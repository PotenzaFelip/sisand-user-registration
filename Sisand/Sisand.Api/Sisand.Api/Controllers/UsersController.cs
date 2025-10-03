using Microsoft.AspNetCore.Mvc;
using Sisand.Domain;
using Sisand.Domain.interfaces;
using Sisand.Domain.DTO;
using Microsoft.AspNetCore.Authorization;
using Sisand.Domain.PasswordHash;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _repo;

    public UsersController(IUserRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _repo.GetUsersAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _repo.GetUserByIdAsync(id);
        return user == null ? NotFound() : Ok(user);
    }
    [HttpGet("By/{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var user = await _repo.GetUserByUsernameAsync(username);
        return user == null ? NotFound() : Ok(user);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDTO dto)
    {
        var hashedPassword = PasswordHasher.HashPassword(dto.Password);
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hashedPassword,
            PasswordSalt = "Static",
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.SaveAllAsync(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateUserDTO dto)
    {
        var hashedPassword = PasswordHasher.HashPassword(dto.Password);
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hashedPassword,
            PasswordSalt = "Static",
            Email = dto.Email,
        };
        await _repo.UpdateAsync(id, user);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.DeleteAsync(id);
        return NoContent();
    }
}