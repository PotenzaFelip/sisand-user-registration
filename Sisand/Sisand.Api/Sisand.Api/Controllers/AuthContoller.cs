using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Sisand.Domain;
using Sisand.Domain.DTO;
using Sisand.Domain.Interfaces;
using Sisand.Domain.PasswordHash;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _config;

    public AuthController(IUserRepository userRepository, IConfiguration config)
    {
        _userRepository = userRepository;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var user = await _userRepository.GetUserByUsernameAsync(dto.Username);

        if (user == null)
        {
            return Unauthorized();
        }

        var isPasswordValid = PasswordHasher.VerifyPassword(
            dto.Password,
            user.PasswordHash,
            user.PasswordSalt
        );

        if (!isPasswordValid)
        {
            return Unauthorized();
        }

        var token = GenerateJwtToken(user);

        return Ok(new { token });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key não está configurada no appsettings.");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}