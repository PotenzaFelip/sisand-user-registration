using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sisand.Domain;
using Sisand.Domain.DTO;
using Sisand.Domain.Interfaces;
using Sisand.Domain.PasswordHash;
using System;
using System.Linq;
using System.Security.Cryptography;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UsersController(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userRepository.GetUsersAsync();

        var dtos = users.Select(u => new UserReadDTO
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            CreatedAt = u.CreatedAt
        });

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) return NotFound();

        var dto = new UserReadDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };

        return Ok(dto);
    }
    [HttpGet("By/{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var user = await _userRepository.GetUserByUsernameAsync(username);
        if (user == null) return NotFound();

        var dto = new UserReadDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };

        return Ok(dto);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDTO dto)
    {
        if (await _userRepository.GetUserByUsernameAsync(dto.Username) != null)
        {
            return BadRequest("O nome de usuário já está em uso.");
        }

        var saltBytes = PasswordHasher.GenerateSalt();
        var saltBase64 = Convert.ToBase64String(saltBytes);

        var hashedPassword = PasswordHasher.HashPassword(dto.Password, saltBytes);

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hashedPassword,
            PasswordSalt = saltBase64,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        _userRepository.Add(user);

        await _unitOfWork.CompleteAsync();

        var readDto = new UserReadDTO { Id = user.Id, Username = user.Username, Email = user.Email, CreatedAt = user.CreatedAt };
        return CreatedAtAction(nameof(Get), new { id = user.Id }, readDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDTO dto)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(id);
        if (existingUser == null) return NotFound();

        existingUser.Username = dto.Username;
        existingUser.Email = dto.Email;

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            var newSaltBytes = PasswordHasher.GenerateSalt();

            existingUser.PasswordHash = PasswordHasher.HashPassword(dto.Password, newSaltBytes);

            existingUser.PasswordSalt = Convert.ToBase64String(newSaltBytes);
        }

        _userRepository.Update(existingUser);

        await _unitOfWork.CompleteAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return NoContent();
        }

        _userRepository.Delete(user);

        await _unitOfWork.CompleteAsync();

        return NoContent();
    }
}