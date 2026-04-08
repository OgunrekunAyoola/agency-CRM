using Moq;
using Crm.Application.Services;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Crm.Application.DTOs.Auth;
using Xunit;
using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace Crm.UnitTests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IGenericRepository<Tenant>> _tenantRepositoryMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly Fixture _fixture;
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _tenantRepositoryMock = new Mock<IGenericRepository<Tenant>>();
        _configurationMock = new Mock<IConfiguration>();
        _fixture = new Fixture();
        _fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        // Setup IConfiguration mock for JWT
        var jwtSectionMock = new Mock<IConfigurationSection>();
        jwtSectionMock.Setup(s => s["Key"]).Returns("super_secret_long_key_for_agency_crm_mvp_development_123!");
        jwtSectionMock.Setup(s => s["Issuer"]).Returns("agency_crm");
        jwtSectionMock.Setup(s => s["Audience"]).Returns("agency_crm");

        _configurationMock.Setup(c => c.GetSection("Jwt")).Returns(jwtSectionMock.Object);

        _service = new AuthService(_userRepositoryMock.Object, _tenantRepositoryMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var password = "Password123!";
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "test@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = UserRole.Admin,
            TenantId = Guid.NewGuid(),
            RefreshTokens = new List<RefreshToken>(),
            Tenant = new Tenant { OnboardingCompleted = true }
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var request = new LoginRequest { Email = user.Email, Password = password };

        // Act
        var result = await _service.LoginAsync(request, "127.0.0.1");

        // Assert
        result.Response.Should().NotBeNull();
        result.Response!.Email.Should().Be(user.Email);
        result.Response.IsOnboardingCompleted.Should().BeTrue();
        result.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        _userRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_NewUser_CreatesTenantAndUser()
    {
        // Arrange
        var request = new RegisterRequest 
        { 
            Email = "new@agency.com", 
            FullName = "Jane Doe", 
            AgencyName = "Doe Agency", 
            Password = "Password123!" 
        };

        _userRepositoryMock.Setup(r => r.GetByEmailAsync(request.Email)).ReturnsAsync((User?)null);

        // Act
        var result = await _service.RegisterAsync(request, "127.0.0.1");

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(request.Email);
        result.IsOnboardingCompleted.Should().BeFalse();
        
        _tenantRepositoryMock.Verify(r => r.AddAsync(It.Is<Tenant>(t => t.Name == request.AgencyName)), Times.Once);
        _userRepositoryMock.Verify(r => r.AddAsync(It.Is<User>(u => u.Email == request.Email)), Times.Once);
    }

    [Fact]
    public async Task CompleteOnboardingAsync_ValidData_UpdatesUserAndTenant()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tenantId = Guid.NewGuid();
        var user = new User { Id = userId, TenantId = tenantId };
        var tenant = new Tenant { Id = tenantId, OnboardingCompleted = false };

        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);
        _tenantRepositoryMock.Setup(r => r.GetByIdAsync(tenantId)).ReturnsAsync(tenant);

        var request = new OnboardingRequest
        {
            JobTitle = "CEO",
            Industry = "SaaS",
            TargetMonthlyRevenue = 50000,
            BrandColor = "#000000"
        };

        // Act
        var success = await _service.CompleteOnboardingAsync(userId, request);

        // Assert
        success.Should().BeTrue();
        user.JobTitle.Should().Be(request.JobTitle);
        tenant.Industry.Should().Be(request.Industry);
        tenant.OnboardingCompleted.Should().BeTrue();
        
        _userRepositoryMock.Verify(r => r.UpdateAsync(user), Times.Once);
        _tenantRepositoryMock.Verify(r => r.UpdateAsync(tenant), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ReturnsNull()
    {
        // Arrange
        var user = new User { Email = "test@example.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectOne") };
        _userRepositoryMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var request = new LoginRequest { Email = user.Email, Password = "WrongPassword" };

        // Act
        var result = await _service.LoginAsync(request, "127.0.0.1");

        // Assert
        result.Response.Should().BeNull();
    }

    [Fact]
    public async Task RefreshTokenAsync_ValidToken_RotatesToken()
    {
        // Arrange
        var oldToken = "old-token";
        var user = _fixture.Create<User>();
        var refreshToken = new RefreshToken { Token = oldToken, Expires = DateTime.UtcNow.AddDays(1), Created = DateTime.UtcNow, UserId = user.Id };
        user.RefreshTokens = new List<RefreshToken> { refreshToken };

        _userRepositoryMock.Setup(r => r.GetByRefreshTokenAsync(oldToken)).ReturnsAsync(user);

        // Act
        var result = await _service.RefreshTokenAsync(oldToken, "127.0.0.1");

        // Assert
        result.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBe(oldToken);
        refreshToken.Revoked.Should().NotBeNull();
        _userRepositoryMock.Verify(r => r.UpdateAsync(user), Times.Once);
    }
}
