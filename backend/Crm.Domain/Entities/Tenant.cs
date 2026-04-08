namespace Crm.Domain.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Industry { get; set; }
    public string? CompanySize { get; set; }
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public string? BrandColor { get; set; }
    public decimal TargetMonthlyRevenue { get; set; }
    public string? BusinessAddress { get; set; }
    public bool OnboardingCompleted { get; set; }
    public ICollection<User> Users { get; set; } = new List<User>();
}
