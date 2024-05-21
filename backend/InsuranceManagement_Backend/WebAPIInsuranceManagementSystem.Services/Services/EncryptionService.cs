using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using WebAPIInsuranceManagementSystem.Services.Services.IServices;

namespace WebAPIInsuranceManagementSystem.Services.Services
{
    public class EncryptionService : IEncryptionService
    {
        public string GenerateHashPassword(string password) 
        {
            try
            {
                using (SHA512 sha512 = SHA512.Create())
                {
                    //compute hash from password and return it as byte array
                    byte[] hashedBytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(password));
                    StringBuilder builder = new StringBuilder();

                    //convert byte array to string
                    foreach (byte b in hashedBytes)
                    {
                        builder.Append(b.ToString("x2"));
                    }

                    //return hashed password
                    return builder.ToString();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error occurred while Generating hash" + ex.Message);
                return null;
            }
        }
    }
}
