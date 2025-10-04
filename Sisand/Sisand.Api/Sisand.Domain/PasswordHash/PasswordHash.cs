using System;
using System.Security.Cryptography;
using System.Text;
using System.Linq;

namespace Sisand.Domain.PasswordHash
{
    public static class PasswordHasher
    {

        public static byte[] GenerateSalt()
        {
            return RandomNumberGenerator.GetBytes(16);
        }

        public static string HashPassword(string password, byte[] saltBytes)
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);

            var combinedBytes = passwordBytes.Concat(saltBytes).ToArray();

            using (var sha256 = SHA256.Create())
            {
                var hashBytes = sha256.ComputeHash(combinedBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }

        public static bool VerifyPassword(string enteredPassword, string storedHash, string storedSaltBase64)
        {
            if (string.IsNullOrEmpty(storedSaltBase64) || string.IsNullOrEmpty(storedHash))
            {
                return false;
            }

            try
            {
                var storedSaltBytes = Convert.FromBase64String(storedSaltBase64);

                var enteredPasswordHash = HashPassword(enteredPassword, storedSaltBytes);

                return enteredPasswordHash == storedHash;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}