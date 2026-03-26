using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    [Table("finanse")]
     public class Finanse
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }
        public string Konto { get; set; }
        public string Nazwa { get; set; }
        public decimal Kwota { get; set; }
        public decimal? Winien { get; set; }
        public decimal? Ma { get; set; }
        public string Waluta { get; set; }
        public string Firma { get; set; }
        public string Rodzaj_Konta { get; set; }
    }
}
