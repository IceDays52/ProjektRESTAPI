using Microsoft.AspNetCore.Http;

namespace ReactApp1.Server.Models
{
    public class UploadDocumentRequest
    {
        public IFormFile File { get; set; } = null!;
        public int UserId { get; set; }
        public string? Category { get; set; }
    }
}