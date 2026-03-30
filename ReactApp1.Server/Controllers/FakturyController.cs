using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.DTOs;
using ReactApp1.Server.Models;
using System.Security.Claims;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FakturyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FakturyController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<FakturaDto>>> GetMyFaktury()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Brak użytkownika.");

            var faktury = await _context.Faktury
                .Where(f => f.UserId == userId.Value)
                .OrderByDescending(f => f.DataWystawienia)
                .Select(f => new FakturaDto
                {
                    Id = f.Id,
                    Numer = f.Numer,
                    DataWystawienia = f.DataWystawienia,
                    DataSprzedazy = f.DataSprzedazy,
                    TerminPlatnosci = f.TerminPlatnosci,
                    Sprzedawca = f.Sprzedawca,
                    Nabywca = f.Nabywca,
                    WartoscNetto = f.WartoscNetto,
                    VatStawka = f.VatStawka,
                    VatKwota = f.VatKwota,
                    WartoscBrutto = f.WartoscBrutto,
                    Kategoria = f.Kategoria,
                    RodzajTransakcji = f.RodzajTransakcji,
                    Status = f.Status
                })
                .ToListAsync();

            return Ok(faktury);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FakturaDto>> GetFaktura(int id)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Brak użytkownika.");

            var faktura = await _context.Faktury
                .Where(f => f.Id == id && f.UserId == userId.Value)
                .Select(f => new FakturaDto
                {
                    Id = f.Id,
                    Numer = f.Numer,
                    DataWystawienia = f.DataWystawienia,
                    DataSprzedazy = f.DataSprzedazy,
                    TerminPlatnosci = f.TerminPlatnosci,
                    Sprzedawca = f.Sprzedawca,
                    Nabywca = f.Nabywca,
                    WartoscNetto = f.WartoscNetto,
                    VatStawka = f.VatStawka,
                    VatKwota = f.VatKwota,
                    WartoscBrutto = f.WartoscBrutto,
                    Kategoria = f.Kategoria,
                    RodzajTransakcji = f.RodzajTransakcji,
                    Status = f.Status
                })
                .FirstOrDefaultAsync();

            if (faktura == null)
                return NotFound("Nie znaleziono faktury.");

            return Ok(faktura);
        }

        [HttpPost]
        public async Task<ActionResult<FakturaDto>> CreateFaktura([FromBody] CreateFakturaDto dto)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Brak użytkownika.");

            if (string.IsNullOrWhiteSpace(dto.Numer))
                return BadRequest("Numer faktury jest wymagany.");

            var faktura = new Faktura
            {
                UserId = userId.Value,
                Numer = dto.Numer,
                DataWystawienia = dto.DataWystawienia,
                DataSprzedazy = dto.DataSprzedazy,
                TerminPlatnosci = dto.TerminPlatnosci,
                Sprzedawca = dto.Sprzedawca,
                Nabywca = dto.Nabywca,
                WartoscNetto = dto.WartoscNetto,
                VatStawka = dto.VatStawka,
                VatKwota = dto.VatKwota,
                WartoscBrutto = dto.WartoscBrutto,
                Kategoria = dto.Kategoria,
                RodzajTransakcji = dto.RodzajTransakcji,
                Status = dto.Status
            };

            _context.Faktury.Add(faktura);
            await _context.SaveChangesAsync();

            var result = new FakturaDto
            {
                Id = faktura.Id,
                Numer = faktura.Numer,
                DataWystawienia = faktura.DataWystawienia,
                DataSprzedazy = faktura.DataSprzedazy,
                TerminPlatnosci = faktura.TerminPlatnosci,
                Sprzedawca = faktura.Sprzedawca,
                Nabywca = faktura.Nabywca,
                WartoscNetto = faktura.WartoscNetto,
                VatStawka = faktura.VatStawka,
                VatKwota = faktura.VatKwota,
                WartoscBrutto = faktura.WartoscBrutto,
                Kategoria = faktura.Kategoria,
                RodzajTransakcji = faktura.RodzajTransakcji,
                Status = faktura.Status
            };

            return CreatedAtAction(nameof(GetFaktura), new { id = faktura.Id }, result);
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(claim))
                return null;

            if (!int.TryParse(claim, out var userId))
                return null;

            return userId;
        }
    }
}