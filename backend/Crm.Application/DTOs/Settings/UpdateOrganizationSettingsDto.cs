namespace Crm.Application.DTOs.Settings;

public class UpdateOrganizationSettingsDto
{
    public string? Name { get; set; }
    public string? BillingEmail { get; set; }
    public string? Currency { get; set; }
    public string? TaxId { get; set; }
    public int? DefaultPaymentTermsDays { get; set; }
    public string? Timezone { get; set; }
    public string? LogoUrl { get; set; }
}
