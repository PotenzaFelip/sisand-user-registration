using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sisand.Domain.interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task SaveAllAsync(User user);
        Task UpdateAsync(int id,User user);
        Task DeleteAsync(int id);

        Task<User> GetUserByUsernameAsync(string username);

    }
}
