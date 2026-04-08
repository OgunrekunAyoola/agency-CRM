namespace Crm.Application.DTOs.Auth;

public class OnboardingRequest
{
    // Step 1: User Profile
    public string? JobTitle { get; set; }
    public string? PhoneNumber { get; set; }

    // Step 2: Agency Details
    public string? Industry { get; set; }
    public string? CompanySize { get; set; }
    public string? Website { get; set; }
    public decimal TargetMonthlyRevenue { get; set; }
    public string? BusinessAddress { get; set; }

    // Step 3: Branding
    public string? BrandColor { get; set; }
    public string? LogoUrl { get; set; }
}
