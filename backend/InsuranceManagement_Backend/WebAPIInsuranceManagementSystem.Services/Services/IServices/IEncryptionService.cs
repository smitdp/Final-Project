using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPIInsuranceManagementSystem.Services.Services.IServices
{
    public interface IEncryptionService
    {
        string GenerateHashPassword(string password);
    }
}
