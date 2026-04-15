using Crm.Domain.Entities;

namespace Crm.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByRefreshTokenAsync(string token);
    Task<User?> GetByResetTokenAsync(string tokenHash);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
}

