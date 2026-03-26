namespace Crm.Application.DTOs.Auth;

public class AuthResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid TenantId { get; set; }
    public string AccessToken { get; set; } = string.Empty;
}

