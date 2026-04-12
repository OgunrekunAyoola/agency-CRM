using Crm.Application.DTOs.Settings;

namespace Crm.Application.Interfaces;

public interface ISettingsService
{
    Task<OrganizationSettingsDto> GetOrganizationSettingsAsync();
    Task<OrganizationSettingsDto> UpdateOrganizationSettingsAsync(UpdateOrganizationSettingsDto dto);
}
