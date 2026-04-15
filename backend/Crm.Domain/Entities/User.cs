namespace Crm.Domain.Entities;

public class User : BaseEntity, ITenantedEntity
{
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }
    public decimal HourlyRate { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; } = new();
    // Password reset fields — token is a SHA-256 hex string, expires 1 hour after generation
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiry { get; set; }
    public ICollection<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
    public ICollection<ProjectMember> ProjectMemberships { get; set; } = new List<ProjectMember>();
}

