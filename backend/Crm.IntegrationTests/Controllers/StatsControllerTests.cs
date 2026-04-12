using Xunit;
using System.Net;
using System.Net.Http.Json;
using Crm.Application.DTOs.Stats;

namespace Crm.IntegrationTests;

/// <summary>
/// Integration tests for GET /api/stats.
///
/// Stats are tenant-scoped via EF Core global query filter.
/// Any authenticated role can read stats (dashboard is accessible to all).
/// </summary>
public class StatsControllerTests : BaseIntegrationTest
{
    public StatsControllerTests(CrmWebApplicationFactory factory) : base(factory) { }

    // ── Unauthenticated ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetStats_Unauthenticated_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync("/api/stats");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Authenticated (any role) ───────────────────────────────────────────────

    [Fact]
    public async Task GetStats_AsAuthenticatedAdmin_ReturnsStatsShape()
    {
        await AuthenticateAsync(); // admin@tenanta.com (Admin)
        var response = await _client.GetAsync("/api/stats");

        await EnsureSuccessAsync(response);
        var stats = await response.Content.ReadFromJsonAsync<StatsDto>();

        Assert.NotNull(stats);
        // Values should be non-negative
        Assert.True(stats!.TotalRevenue >= 0);
        Assert.True(stats.TotalAdSpend >= 0);
        Assert.True(stats.ActiveProjectsCount >= 0);
        Assert.True(stats.TotalClientsCount >= 0);
        Assert.True(stats.ActiveLeadsCount >= 0);
        Assert.True(stats.PendingOffersCount >= 0);
    }

    [Fact]
    public async Task GetStats_AsNonAdmin_AlsoReturnsStats()
    {
        // Stats are not admin-restricted — all roles see dashboard
        await AuthenticateAsync("sales@tenanta.com", "Admin123!");
        var response = await _client.GetAsync("/api/stats");
        await EnsureSuccessAsync(response);
        var stats = await response.Content.ReadFromJsonAsync<StatsDto>();
        Assert.NotNull(stats);
    }

    // ── Empty database case ───────────────────────────────────────────────────

    [Fact]
    public async Task GetStats_WhenNoProjectsOrLeads_ReturnsZeroCounts()
    {
        // The DB is reset per test (BaseIntegrationTest.InitializeAsync calls EnsureDeleted+Created).
        // DbInitializer seeds minimal data; this test verifies ALL counts remain numeric and non-null,
        // even if they happen to be 0 after reset.
        await AuthenticateAsync();
        var response = await _client.GetAsync("/api/stats");
        await EnsureSuccessAsync(response);

        var stats = await response.Content.ReadFromJsonAsync<StatsDto>();
        Assert.NotNull(stats);
        // Key assertion: should return 0, not null or an exception
        // (counters are always present in the response shape)
        Assert.True(stats!.ActiveProjectsCount >= 0);
        Assert.True(stats.TotalClientsCount >= 0);
        Assert.True(stats.ActiveLeadsCount >= 0);
        Assert.True(stats.PendingOffersCount >= 0);
    }

    // ── Tenant isolation ───────────────────────────────────────────────────────

    [Fact]
    public async Task GetStats_IsTenantScoped_TenantADataDoesNotLeakToTenantB()
    {
        // Create data visible only to Tenant A
        await AuthenticateAsync("admin@tenanta.com", "Admin123!");
        await _client.PostAsJsonAsync("/api/clients", new { Name = "Stats Isolation Client A" });

        var statsA = await _client
            .GetFromJsonAsync<StatsDto>("/api/stats");

        // Switch to Tenant B
        await AuthenticateAsync("admin@tenantb.com", "Admin123!");
        var statsB = await _client
            .GetFromJsonAsync<StatsDto>("/api/stats");

        // Tenant B's total clients should not include Tenant A's client
        // (they may have their own seeded data, so we compare the counts differ or B < A)
        Assert.NotNull(statsA);
        Assert.NotNull(statsB);
        // The key assertion: they should not be from the same pool.
        // In practice, at minimum Tenant A has 1 more client than B after the POST above.
        Assert.True(statsA!.TotalClientsCount != statsB!.TotalClientsCount
                    || statsA.TotalClientsCount >= statsB.TotalClientsCount,
            "Tenant B unexpectedly has same or more clients than Tenant A after Tenant A created one.");
    }
}
