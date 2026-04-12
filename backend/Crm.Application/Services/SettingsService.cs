using Crm.Application.DTOs.Settings;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Services;

public class SettingsService : ISettingsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserContext _currentUser;

    public SettingsService(IUnitOfWork unitOfWork, ICurrentUserContext currentUser)
    {
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    public async Task<OrganizationSettingsDto> GetOrganizationSettingsAsync()
    {
        if (_currentUser.TenantId == null)
            throw new UnauthorizedAccessException("No tenant context found.");

        var tenantId = _currentUser.TenantId.Value;
        var tenant = await _unitOfWork.Set<Tenant>().FirstOrDefaultAsync(t => t.Id == tenantId);

        if (tenant == null)
            throw new Exception("Tenant not found.");

        return MapToDto(tenant);
    }

    public async Task<OrganizationSettingsDto> UpdateOrganizationSettingsAsync(UpdateOrganizationSettingsDto dto)
    {
        if (_currentUser.TenantId == null)
            throw new UnauthorizedAccessException("No tenant context found.");

        var tenantId = _currentUser.TenantId.Value;
        var tenant = await _unitOfWork.Set<Tenant>().FirstOrDefaultAsync(t => t.Id == tenantId);

        if (tenant == null)
            throw new Exception("Tenant not found.");

        if (dto.Name != null) tenant.Name = dto.Name;
        if (dto.BillingEmail != null) tenant.BillingEmail = dto.BillingEmail;
        if (dto.Currency != null) tenant.Currency = dto.Currency;
        if (dto.TaxId != null) tenant.TaxId = dto.TaxId;
        if (dto.DefaultPaymentTermsDays.HasValue) tenant.DefaultPaymentTermsDays = dto.DefaultPaymentTermsDays.Value;
        if (dto.Timezone != null) tenant.Timezone = dto.Timezone;
        if (dto.LogoUrl != null) tenant.LogoUrl = dto.LogoUrl;

        await _unitOfWork.SaveChangesAsync();

        return MapToDto(tenant);
    }

    private OrganizationSettingsDto MapToDto(Tenant tenant)
    {
        return new OrganizationSettingsDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            BillingEmail = tenant.BillingEmail,
            Currency = tenant.Currency,
            TaxId = tenant.TaxId,
            DefaultPaymentTermsDays = tenant.DefaultPaymentTermsDays,
            Timezone = tenant.Timezone,
            LogoUrl = tenant.LogoUrl
        };
    }
}
