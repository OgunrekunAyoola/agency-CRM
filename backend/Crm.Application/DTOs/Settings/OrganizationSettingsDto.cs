namespace Crm.Application.DTOs.Settings;

public class OrganizationSettingsDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? BillingEmail { get; set; }
    public string Currency { get; set; } = "USD";
    public string? TaxId { get; set; }
    public int DefaultPaymentTermsDays { get; set; }
    public string? Timezone { get; set; }
    public string? LogoUrl { get; set; }
}
