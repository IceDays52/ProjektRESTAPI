using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace ReactApp1.Server.Models
{
    [Table("users")]
    public class User
    {
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

        public bool IsEmailConfirmed { get; set; } = false;

        public string? EmailVerificationCode { get; set; }

        public DateTime? EmailVerificationCodeExpiresAt { get; set; }


        public ICollection<Faktura> Faktury { get; set; } = new List<Faktura>();
    }
}