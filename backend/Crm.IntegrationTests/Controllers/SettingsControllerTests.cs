using Xunit;
using System.Net;
using System.Net.Http.Json;
using Crm.Application.DTOs.Settings;

namespace Crm.IntegrationTests;

/// <summary>
/// Integration tests for GET /api/settings/organization
/// and PATCH /api/settings/organization.
///
/// Test user credentials come from DbInitializer:
///   admin@tenanta.com     / Admin123!  → Admin, Tenant A
///   admin@tenantb.com     / Admin123!  → Admin, Tenant B
///   sales@tenanta.com     / Admin123!  → SalesManager, Tenant A
/// </summary>
public class SettingsControllerTests : BaseIntegrationTest
{
    public SettingsControllerTests(CrmWebApplicationFactory factory) : base(factory) { }

    // ── Unauthenticated ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetSettings_Unauthenticated_ReturnsUnauthorized()
    {
        // No auth headers — client is anonymous
        var response = await _client.GetAsync("/api/settings/organization");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task PatchSettings_Unauthenticated_ReturnsUnauthorized()
    {
        var response = await _client.PatchAsJsonAsync(
            "/api/settings/organization",
            new UpdateOrganizationSettingsDto { Currency = "EUR" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Non-admin (SalesManager) ───────────────────────────────────────────────

    [Fact]
    public async Task GetSettings_AsNonAdmin_ReturnsForbidden()
    {
        // sales@tenanta.com has role SalesManager, not Admin
        await AuthenticateAsync("sales@tenanta.com", "Admin123!");
        var response = await _client.GetAsync("/api/settings/organization");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task PatchSettings_AsNonAdmin_ReturnsForbidden()
    {
        await AuthenticateAsync("sales@tenanta.com", "Admin123!");
        var response = await _client.PatchAsJsonAsync(
            "/api/settings/organization",
            new UpdateOrganizationSettingsDto { Currency = "GBP" });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    // ── Happy path (Admin) ────────────────────────────────────────────────────

    [Fact]
    public async Task GetSettings_AsAdmin_ReturnsOrganizationSettings()
    {
        await AuthenticateAsync(); // admin@tenanta.com
        var response = await _client.GetAsync("/api/settings/organization");

        await EnsureSuccessAsync(response);
        var dto = await response.Content.ReadFromJsonAsync<OrganizationSettingsDto>();

        Assert.NotNull(dto);
        // Seeded tenant name for Tenant A
        Assert.False(string.IsNullOrWhiteSpace(dto!.Name));
        // Defaults
        Assert.Equal("USD", dto.Currency);
        Assert.Equal(30, dto.DefaultPaymentTermsDays);
    }

    [Fact]
    public async Task PatchSettings_AsAdmin_UpdatesValuesAndReflectsInGet()
    {
        await AuthenticateAsync();

        var patch = new UpdateOrganizationSettingsDto
        {
            BillingEmail = "billing@agency-test.com",
            Currency = "EUR",
            TaxId = "VAT-987654",
            DefaultPaymentTermsDays = 45,
            Timezone = "Europe/London"
        };

        var patchResp = await _client.PatchAsJsonAsync("/api/settings/organization", patch);
        await EnsureSuccessAsync(patchResp);

        var updated = await patchResp.Content.ReadFromJsonAsync<OrganizationSettingsDto>();
        Assert.Equal("billing@agency-test.com", updated!.BillingEmail);
        Assert.Equal("EUR", updated.Currency);
        Assert.Equal("VAT-987654", updated.TaxId);
        Assert.Equal(45, updated.DefaultPaymentTermsDays);
        Assert.Equal("Europe/London", updated.Timezone);

        // Verify persistence via a fresh GET
        var getResp = await _client.GetAsync("/api/settings/organization");
        await EnsureSuccessAsync(getResp);
        var fetched = await getResp.Content.ReadFromJsonAsync<OrganizationSettingsDto>();
        Assert.Equal("EUR", fetched!.Currency);
        Assert.Equal(45, fetched.DefaultPaymentTermsDays);
    }

    // ── Tenant isolation ───────────────────────────────────────────────────────

    [Fact]
    public async Task Settings_AreTenantScoped_TenantACannotSeeTenantBSettings()
    {
        // First: patch Tenant B settings
        await AuthenticateAsync("admin@tenantb.com", "Admin123!");
        await _client.PatchAsJsonAsync("/api/settings/organization",
            new UpdateOrganizationSettingsDto { TaxId = "TENANTB-TAX" });

        // Then: read settings as Tenant A
        await AuthenticateAsync("admin@tenanta.com", "Admin123!");
        var resp = await _client.GetAsync("/api/settings/organization");
        await EnsureSuccessAsync(resp);
        var dto = await resp.Content.ReadFromJsonAsync<OrganizationSettingsDto>();

        // Tenant A should NOT see Tenant B's TaxId
        Assert.NotEqual("TENANTB-TAX", dto!.TaxId);
    }
}
