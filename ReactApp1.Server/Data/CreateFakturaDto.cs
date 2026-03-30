namespace ReactApp1.Server.DTOs
{
    public class CreateFakturaDto
    {
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
    }
    public class FakturaDto
    {
        public int Id { get; set; }
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
        public string Status { get; set; } = string.Empty;
    }
}
