using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Crm.Domain.Entities;
using Crm.Application.Interfaces;
using Crm.Application.DTOs.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace Crm.Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IGenericRepository<Tenant> _tenantRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IGenericRepository<Tenant> tenantRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponse?> GetMeAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        return new AuthResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            TenantId = user.TenantId,
            IsOnboardingCompleted = user.Tenant?.OnboardingCompleted ?? false
        };
    }

    public async Task<(AuthResponse? Response, string? AccessToken, string? RefreshToken)> LoginAsync(LoginRequest request, string ipAddress)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return (null, null, null);
        }

        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken(ipAddress, user.Id);

        user.RefreshTokens.Add(refreshToken);
        await _userRepository.UpdateAsync(user);

        var response = new AuthResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            TenantId = user.TenantId,
            IsOnboardingCompleted = user.Tenant?.OnboardingCompleted ?? false
        };

        return (response, accessToken, refreshToken.Token);
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string ipAddress)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null) throw new InvalidOperationException("User with this email already exists.");

        // 1. Create Tenant
        var tenant = new Tenant
        {
            Id = Guid.NewGuid(),
            Name = request.AgencyName,
            OnboardingCompleted = false
        };
        await _tenantRepository.AddAsync(tenant);

        // 2. Create User (Admin)
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Admin,
            TenantId = tenant.Id
        };
        await _userRepository.AddAsync(user);

        return new AuthResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            TenantId = user.TenantId,
            IsOnboardingCompleted = false // New registrations always start as incomplete
        };
    }

    public async Task<bool> CompleteOnboardingAsync(Guid userId, OnboardingRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        var tenant = await _tenantRepository.GetByIdAsync(user.TenantId);
        if (tenant == null) return false;

        // Update User Profile
        user.JobTitle = request.JobTitle;
        user.PhoneNumber = request.PhoneNumber;
        user.AvatarUrl = request.LogoUrl; // Using logo as avatar for now or we can separate
        await _userRepository.UpdateAsync(user);

        // Update Tenant Profile
        tenant.Industry = request.Industry;
        tenant.CompanySize = request.CompanySize;
        tenant.Website = request.Website;
        tenant.TargetMonthlyRevenue = request.TargetMonthlyRevenue;
        tenant.BusinessAddress = request.BusinessAddress;
        tenant.BrandColor = request.BrandColor;
        tenant.LogoUrl = request.LogoUrl;
        tenant.OnboardingCompleted = true;
        await _tenantRepository.UpdateAsync(tenant);

        return true;
    }

    public async Task<(AuthResponse? Response, string? AccessToken, string? RefreshToken)> RefreshTokenAsync(string token, string ipAddress)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(token);

        if (user == null) return (null, null, null);

        var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

        if (!refreshToken.IsActive) return (null, null, null);

        // Rotate token
        var newRefreshToken = RotateRefreshToken(refreshToken, ipAddress);
        user.RefreshTokens.Add(newRefreshToken);

        await _userRepository.UpdateAsync(user);

        var accessToken = GenerateJwtToken(user);

        return (new AuthResponse
        {
            Email = user.Email,
            FullName = user.FullName
        }, accessToken, newRefreshToken.Token);
    }


    public async Task<bool> RevokeTokenAsync(string token, string ipAddress)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(token);
        if (user == null) return false;

        var refreshToken = user.RefreshTokens.Single(x => x.Token == token);
        if (!refreshToken.IsActive) return false;

        // Revoke token
        refreshToken.Revoked = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;

        await _userRepository.UpdateAsync(user);
        return true;
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is missing.")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim("sub", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("tenant_id", user.TenantId.ToString()),
            new Claim("role", user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private RefreshToken GenerateRefreshToken(string ipAddress, Guid userId)
    {
        return new RefreshToken
        {
            Token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64)),
            Expires = DateTime.UtcNow.AddDays(7),
            Created = DateTime.UtcNow,
            CreatedByIp = ipAddress,
            UserId = userId
        };
    }

    private RefreshToken RotateRefreshToken(RefreshToken refreshToken, string ipAddress)
    {
        var newRefreshToken = GenerateRefreshToken(ipAddress, refreshToken.UserId);
        refreshToken.Revoked = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        refreshToken.ReplacedByToken = newRefreshToken.Token;
        return newRefreshToken;
    }
}

