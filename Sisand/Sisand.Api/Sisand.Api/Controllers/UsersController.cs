using Microsoft.AspNetCore.Mvc;
using Sisand.Domain;
using Sisand.Domain.interfaces;
using Sisand.Domain.DTO;
using Microsoft.AspNetCore.Authorization;

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

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDTO dto)
    {
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = dto.PasswordHash,
            PasswordSalt = dto.PasswordSalt,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.SaveAllAsync(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateUserDTO dto)
    {
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = dto.PasswordHash,
            PasswordSalt = dto.PasswordSalt,
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