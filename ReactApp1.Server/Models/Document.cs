using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    [Table("documents")]
    public class ClientDocument
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string OriginalFileName { get; set; } = "";
        public string StoredFileName { get; set; } = "";
        public string ContentType { get; set; } = "";
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
        public string? Category { get; set; }
        public string Status { get; set; } = "uploaded";
    }
}