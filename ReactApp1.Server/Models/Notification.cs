using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    [Table("notification")]
    public class Notification
    {
        public int Id { get; set; }
        public string UserLogin { get; set; } = "";
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }
}