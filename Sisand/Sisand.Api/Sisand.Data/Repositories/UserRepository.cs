using Microsoft.EntityFrameworkCore;
using Sisand.Data;
using Sisand.Domain;
using Sisand.Domain.Interfaces;

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
            return await _context.Users.AsNoTracking().ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(u => u.Username == username);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
        }

        public void Delete(User user)
        {
            _context.Users.Remove(user);
        }
    }
}