using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Mysqlx.Connection;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;




var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("https://localhost:5173", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});
builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("SmtpSettings"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));



builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "auth_cookie";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;

        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;

        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };

        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });


builder.Services.AddAuthorization();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/statystyki/miesieczne/{login}", async (string login, AppDbContext db) =>
{
    var dane = await db.Finanse
        .Where(f => f.Firma == login)
        .GroupBy(f => new { f.Data.Year, f.Data.Month })
        .Select(g => new
        {
            Year = g.Key.Year,
            Month = g.Key.Month,

            przychody = g.Where(x => x.Rodzaj_Konta == "Przychody")
                         .Sum(x => (decimal?)x.Kwota) ?? 0,

            koszty = g.Where(x => x.Rodzaj_Konta == "Koszty rodzajowe")
                      .Sum(x => (decimal?)x.Kwota) ?? 0
        })
        .OrderBy(x => x.Year)
        .ThenBy(x => x.Month)
        .ToListAsync();

    var wynik = dane.Select(x => new
    {
        miesiac = $"{x.Year}-{x.Month:D2}",
        przychody = x.przychody,
        koszty = x.koszty,
        wynik = x.przychody - x.koszty
    });

    return Results.Ok(wynik);
});
var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");

builder.Services.Configure<SmtpSettings>(options =>
{
    options.Password = smtpPassword;
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();