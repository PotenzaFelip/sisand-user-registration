using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sisand.Domain.DTO
{
    public class UpdateUserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string? Phone { get; set; }
        public string? CPF { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? CEP { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public bool IsAdmin { get; set; }
        public bool Status { get; set; }
    }
}
