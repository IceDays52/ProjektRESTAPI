using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ReactApp1.Server.Data;
using ReactApp1.Server.Models;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly SmtpSettings _smtpSettings;

        public AuthController(AppDbContext context, IOptions<SmtpSettings> smtpOptions)
        {
            _context = context;
            _smtpSettings = smtpOptions.Value;
        }

        private string GenerateVerificationCode()
        {
            return RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var loginExists = await _context.Users.AnyAsync(x => x.Login == dto.Login);
            if (loginExists)
            {
                return BadRequest(new { message = "Login jest już zajęty." });
            }

            var emailExists = await _context.Users.AnyAsync(x => x.Email == dto.Email);
            if (emailExists)
            {
                return BadRequest(new { message = "Email jest już zajęty." });
            }

            var verificationCode = GenerateVerificationCode();

            var newUser = new User
            {
                Login = dto.Login,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                BirthDate = dto.BirthDate,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsEmailConfirmed = false,
                EmailVerificationCode = verificationCode,
                EmailVerificationCodeExpiresAt = DateTime.UtcNow.AddMinutes(10)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            Console.WriteLine($"REJESTRACJA OK. Wysyłam kod {verificationCode} na {newUser.Email}");

            try
            {
                await SendVerificationEmail(newUser.Email, verificationCode);
                Console.WriteLine("MAIL VERIFY WYSLANY OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine("BLAD WYSYLKI VERIFY EMAIL:");
                Console.WriteLine(ex.ToString());

                return StatusCode(500, new { message = $"Nie można wysłać emaila: {ex.Message}" });
            }

            return Ok(new
            {
                message = "Rejestracja zakończona sukcesem. Sprawdź swoją skrzynkę email, aby potwierdzić konto."
            });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
            {
                return NotFound(new { message = "Nie znaleziono użytkownika." });
            }

            if (user.IsEmailConfirmed)
            {
                return BadRequest(new { message = "Email jest już potwierdzony." });
            }

            if (string.IsNullOrEmpty(user.EmailVerificationCode) || user.EmailVerificationCode != dto.Code)
            {
                return BadRequest(new { message = "Nieprawidłowy kod." });
            }

            if (user.EmailVerificationCodeExpiresAt == null || user.EmailVerificationCodeExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Kod wygasł." });
            }

            user.IsEmailConfirmed = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationCodeExpiresAt = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Email został potwierdzony." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Login == dto.Login);

            if (user == null)
            {
                return Unauthorized(new { message = "Nieprawidłowy login lub hasło" });
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!passwordValid)
            {
                return Unauthorized(new { message = "Nieprawidłowy login lub hasło" });
            }

            if (!user.IsEmailConfirmed)
            {
                var verificationCode = GenerateVerificationCode();

                user.EmailVerificationCode = verificationCode;
                user.EmailVerificationCodeExpiresAt = DateTime.UtcNow.AddMinutes(10);

                await _context.SaveChangesAsync();

                try
                {
                    await SendVerificationEmail(user.Email, verificationCode);
                    Console.WriteLine($"MAIL VERIFY PRZY LOGINIE WYSLANY OK na {user.Email}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("BLAD WYSYLKI VERIFY EMAIL PRZY LOGINIE:");
                    Console.WriteLine(ex.ToString());

                    return StatusCode(500, new { message = $"Nie można wysłać kodu weryfikacyjnego: {ex.Message}" });
                }

                return Unauthorized(new
                {
                    message = "Email nie został potwierdzony. Wysłaliśmy nowy kod weryfikacyjny.",
                    requiresEmailVerification = true,
                    email = user.Email
                });
            }

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Login),
        new Claim(ClaimTypes.Email, user.Email)
    };

            var identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
                });

            return Ok(new { message = "Zalogowano poprawnie" });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var login = User.Identity?.Name;

            if (string.IsNullOrEmpty(login))
                return Unauthorized();

            var user = _context.Users.FirstOrDefault(u => u.Login == login);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                id = user.Id,
                login = user.Login,
                email = user.Email
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Wylogowano" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Ok(new { message = "Jeśli konto istnieje, link do resetu hasła został wysłany." });

            var token = Guid.NewGuid().ToString();

            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);

            await _context.SaveChangesAsync();

            var link = $"http://localhost:5173/reset-password?token={token}";

            try
            {
                await SendResetPasswordEmail(user.Email, link);
                Console.WriteLine($"MAIL RESET WYSLANY OK na {user.Email}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("BLAD WYSYLKI RESET EMAIL:");
                Console.WriteLine(ex.ToString());

                return StatusCode(500, new { message = $"Nie można wysłać maila resetującego: {ex.Message}" });
            }

            return Ok(new { message = "Jeśli konto istnieje, link do resetu hasła został wysłany." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.ResetToken == dto.Token &&
                u.ResetTokenExpiry != null &&
                u.ResetTokenExpiry > DateTime.UtcNow);

            if (user == null)
                return BadRequest(new { message = "Link wygasł lub jest nieprawidłowy." });

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Hasło zostało zmienione." });
        }

        [HttpGet("validate-reset-token")]
        public async Task<IActionResult> ValidateResetToken([FromQuery] string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.ResetToken == token &&
                u.ResetTokenExpiry != null &&
                u.ResetTokenExpiry > DateTime.UtcNow);

            if (user == null)
                return BadRequest(new { message = "Link wygasl lub jest nieprawidlowy." });

            return Ok(new { message = "Token jest poprawny." });
        }

        private async Task SendResetPasswordEmail(string toEmail, string resetLink)
        {
            using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
            {
                Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                Subject = "Reset hasła",
                Body = $@"
                    <h2>Reset hasła</h2>
                    <p>Otrzymaliśmy prośbę o zresetowanie hasła.</p>
                    <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
                    <p><a href='{resetLink}'>Zmień hasło</a></p>
                    <p>Jeśli to nie Ty, zignoruj tę wiadomość.</p>
                    <p>Link wygaśnie za 15 minut.</p>
                ",
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }

        private async Task SendVerificationEmail(string toEmail, string code)
        {
            using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
            {
                Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                Subject = "Potwierdzenie rejestracji konta",
                Body = $@"
                    <h2>Potwierdzenie rejestracji</h2>
                    <p>Dziękujemy za założenie konta.</p>
                    <p>Wpisz poniższy kod w formularzu weryfikacji:</p>
                    <p><strong>{code}</strong></p>
                    <p>Kod jest ważny przez 10 minut.</p>
                    <p>Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
                ",
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}