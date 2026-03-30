using System;

namespace ReactApp1.Server.Models
{
    public class Faktura
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string Numer { get; set; } = string.Empty;
        public DateTime DataWystawienia { get; set; }
        public DateTime DataSprzedazy { get; set; }
        public DateTime TerminPlatnosci { get; set; }

        public string Sprzedawca { get; set; } = string.Empty;
        public string Nabywca { get; set; } = string.Empty;

        public decimal WartoscNetto { get; set; }
        public decimal VatStawka { get; set; }
        public decimal VatKwota { get; set; }
        public decimal WartoscBrutto { get; set; }

        public string Kategoria { get; set; } = string.Empty;
        public string RodzajTransakcji { get; set; } = string.Empty;
        public string Status { get; set; } = "Wystawiona";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}
