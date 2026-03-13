using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    [Table("uzytkownicy")]
    public class ContactMessage
    {
        [Key]
        public int id { get; set; }

        public string imie { get; set; } = string.Empty;

        public string email { get; set; } = string.Empty;

        public string wiadomosc { get; set; } = string.Empty;

        public DateTime data_rejestracji { get; set; }
    }
}
