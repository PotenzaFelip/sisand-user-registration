using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sisand.Domain;
using Sisand.Domain.DTO;
using Sisand.Domain.Interfaces;
using Sisand.Domain.PasswordHash;
using System;
using System.Linq;
using System.Threading.Tasks;

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

    private UserReadDTO MapUserToReadDto(User user)
    {
        return new UserReadDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt,

            Name = user.Name,
            Phone = user.Phone,
            CPF = user.CPF,
            DateOfBirth = user.DateOfBirth,
            CEP = user.CEP,
            Address = user.Address,
            City = user.City,
            State = user.State,
            IsAdmin = user.IsAdmin,
            Status = user.Status
        };
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userRepository.GetUsersAsync();
        var dtos = users.Select(MapUserToReadDto);
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) return NotFound();

        var dto = MapUserToReadDto(user);
        return Ok(dto);
    }

    [HttpGet("By/{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var user = await _userRepository.GetUserByUsernameAsync(username);
        if (user == null) return NotFound();

        var dto = MapUserToReadDto(user);
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

        var PasswordSalt = PasswordHasher.GenerateSalt();
        var hashedPassword = PasswordHasher.HashPassword(dto.Password, PasswordSalt);

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hashedPassword,
            PasswordSalt = Convert.ToBase64String(PasswordSalt),
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow,

            Name = dto.Name,
            Phone = dto.Phone,
            CPF = dto.CPF,
            DateOfBirth = dto.DateOfBirth,

            CEP = dto.CEP,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,

            IsAdmin = dto.IsAdmin,
            Status = dto.Status
        };

        _userRepository.Add(user);
        await _unitOfWork.CompleteAsync();

        var readDto = MapUserToReadDto(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, readDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDTO dto)
    {
        var existingUser = await _userRepository.GetUserByIdAsync(id);
        if (existingUser == null) return NotFound();

        existingUser.Username = dto.Username;
        existingUser.Email = dto.Email;
        existingUser.Name = dto.Name;

        existingUser.Phone = dto.Phone;
        existingUser.CPF = dto.CPF;
        existingUser.DateOfBirth = dto.DateOfBirth;

        existingUser.CEP = dto.CEP;
        existingUser.Address = dto.Address;
        existingUser.City = dto.City;
        existingUser.State = dto.State;

        existingUser.IsAdmin = dto.IsAdmin;
        existingUser.Status = dto.Status;

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            var PasswordSalt = PasswordHasher.GenerateSalt();
            existingUser.PasswordHash = PasswordHasher.HashPassword(dto.Password, PasswordSalt);
            existingUser.PasswordSalt = Convert.ToBase64String(PasswordSalt);
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