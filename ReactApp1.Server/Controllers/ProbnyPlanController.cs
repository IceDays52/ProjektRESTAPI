using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProbnyPlanController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProbnyPlanController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> DodajEmail([FromBody] Probnyplan plan)
        {
            if (string.IsNullOrWhiteSpace(plan.Email))
                return BadRequest("Email jest wymagany");

            plan.DataDodania = DateTime.Now;

            _context.ProbnePlany.Add(plan);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Email zapisany w bazie" });
        }
    }
}