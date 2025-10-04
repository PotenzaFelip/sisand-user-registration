using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sisand.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(int id); 
        Task<User?> GetUserByUsernameAsync(string username);

        void Add(User user);

        void Update(User user);

        void Delete(User user);
    }
}