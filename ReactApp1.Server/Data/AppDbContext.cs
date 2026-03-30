using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ContactMessage> Uzytkownicy { get; set; }
        public DbSet<Probnyplan> ProbnePlany { get; set; }
        public DbSet<Finanse> Finanse { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ClientDocument> Documents { get; set; }
        public DbSet<Faktura> Faktury { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Faktura>().ToTable("faktury");

            modelBuilder.Entity<Faktura>()
                .HasOne(f => f.User)
                .WithMany(u => u.Faktury)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Faktura>()
                .Property(f => f.WartoscNetto)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Faktura>()
                .Property(f => f.VatStawka)
                .HasPrecision(5, 2);

            modelBuilder.Entity<Faktura>()
                .Property(f => f.VatKwota)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Faktura>()
                .Property(f => f.WartoscBrutto)
                .HasPrecision(18, 2);
        }
    }
}