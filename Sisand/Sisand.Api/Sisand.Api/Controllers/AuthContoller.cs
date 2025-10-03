using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Sisand.Domain;
using Sisand.Domain.interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Sisand.Domain.DTO;
using Sisand.Domain.interfaces;
using Sisand.Domain.PasswordHash;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IConfiguration _config;

    public AuthController(IUserRepository repo, IConfiguration config)
    {
        _repo = repo;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var hashedPassword = PasswordHasher.HashPassword(dto.Password);
        var user = await _repo.GetUserByUsernameAsync(dto.Username);
        if (user == null || user.PasswordHash != hashedPassword) return Unauthorized();

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}