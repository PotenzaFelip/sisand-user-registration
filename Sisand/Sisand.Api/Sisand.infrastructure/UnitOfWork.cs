using Sisand.Data;
using Sisand.Domain.Interfaces;
using Sisand.Infrastructure;
using System.Threading.Tasks;

namespace Sisand.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SisandDbContext _context;

        public UnitOfWork(SisandDbContext context)
        {
            _context = context;
        }

        public async Task<int> CompleteAsync()
        {         
            return await _context.SaveChangesAsync();
        }

    }
}