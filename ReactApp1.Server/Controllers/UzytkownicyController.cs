using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;



namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UzytkownicyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UzytkownicyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var lista = await _context.Uzytkownicy.ToListAsync();
            return Ok(lista);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContactMessage nowaWiadomosc)
        {
            nowaWiadomosc.data_rejestracji = DateTime.Now;

            _context.Uzytkownicy.Add(nowaWiadomosc);
            await _context.SaveChangesAsync();

            return Ok(nowaWiadomosc);
        }
      


    }
}