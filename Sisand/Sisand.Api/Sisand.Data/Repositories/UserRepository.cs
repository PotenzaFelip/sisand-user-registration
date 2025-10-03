using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Sisand.Domain;
using Sisand.Domain.interfaces;

namespace Sisand.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SisandDbContext _context;

        public UserRepository(SisandDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task SaveAllAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, User user)
        {
            var existingUser = await _context.Users.FindAsync(id);

            if (existingUser == null)           
                throw new KeyNotFoundException($"Usuário com ID {id} não encontrado para atualização.");

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.PasswordHash = user.PasswordHash;
            existingUser.PasswordSalt = user.PasswordSalt;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

    }

}
