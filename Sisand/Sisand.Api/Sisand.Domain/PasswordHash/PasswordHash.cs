using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Sisand.Domain.PasswordHash
{
    public static class PasswordHasher
    {
        private const string StaticSalt = "MEU_SALT_SECRETO_E_ESTATICO_DEVE_SER_BEM_LONGO";

        public static string HashPassword(string password)
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var saltBytes = Encoding.UTF8.GetBytes(StaticSalt);

            var combinedBytes = new byte[passwordBytes.Length + saltBytes.Length];
            Buffer.BlockCopy(passwordBytes, 0, combinedBytes, 0, passwordBytes.Length);
            Buffer.BlockCopy(saltBytes, 0, combinedBytes, passwordBytes.Length, saltBytes.Length);


            using (var sha256 = SHA256.Create())
            {
                var hashBytes = sha256.ComputeHash(combinedBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}
