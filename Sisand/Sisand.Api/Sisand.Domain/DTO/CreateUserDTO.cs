using System;
using System.ComponentModel.DataAnnotations;

namespace Sisand.Domain.DTO
{
    public class CreateUserDTO
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Phone { get; set; }
        public string? CPF { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string? CEP { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }

        public bool IsAdmin { get; set; } = false;
        public bool Status { get; set; } = true;
    }
}