using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public DocumentsController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] UploadDocumentRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("Brak pliku.");

            var allowedExtensions = new[] { ".pdf", ".zip", ".xls", ".xlsx" };
            var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return BadRequest("Dozwolone są tylko PDF, ZIP, XLS, XLSX.");

            var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
            if (!userExists)
                return BadRequest("Nie istnieje użytkownik.");

            var storagePath = Path.Combine(_environment.ContentRootPath, "Storage", "Documents");

            if (!Directory.Exists(storagePath))
                Directory.CreateDirectory(storagePath);

            var storedFileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(storagePath, storedFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            try
            {
                var document = new ClientDocument
                {
                    UserId = request.UserId,
                    OriginalFileName = request.File.FileName,
                    StoredFileName = storedFileName,
                    ContentType = request.File.ContentType,
                    FileSize = request.File.Length,
                    UploadedAt = DateTime.Now,
                    Category = request.Category,
                    Status = "uploaded"
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Plik został zapisany.",
                    documentId = document.Id
                });
            }
            catch (Exception ex)
            {
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);

                return StatusCode(500, $"Błąd zapisu do bazy: {ex.Message}");
            }
        }

        [HttpGet("my/{userId}")]
        public async Task<IActionResult> GetMyDocuments(int userId)
        {
            var documents = await _context.Documents
                .Where(d => d.UserId == userId)
                .OrderByDescending(d => d.UploadedAt)
                .Select(d => new
                {
                    d.Id,
                    d.OriginalFileName,
                    d.ContentType,
                    d.FileSize,
                    d.UploadedAt,
                    d.Category,
                    d.Status
                })
                .ToListAsync();

            return Ok(documents);
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var document = await _context.Documents.FirstOrDefaultAsync(d => d.Id == id);

            if (document == null)
                return NotFound("Nie znaleziono dokumentu.");

            var fullPath = Path.Combine(_environment.ContentRootPath, "Storage", "Documents", document.StoredFileName);

            if (!System.IO.File.Exists(fullPath))
                return NotFound("Plik nie istnieje na serwerze.");

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);

            return File(bytes, document.ContentType, document.OriginalFileName);
        }
    }
}