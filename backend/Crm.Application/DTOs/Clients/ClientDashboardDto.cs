using Crm.Application.DTOs.Clients;

namespace Crm.Application.DTOs.Clients;

/// <summary>
/// Aggregated dashboard data for a single client.
/// Returned by GET /api/clients/{id}/dashboard.
/// </summary>
public class ClientDashboardDto
{
    // Identity
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string LegalName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string BusinessAddress { get; set; } = string.Empty;

    // Activity counts (tenant-scoped, client-scoped via ClientId FK)
    public int ActiveProjectsCount { get; set; }
    public int OpenLeadsCount { get; set; }
    public int PendingOffersCount { get; set; }

    // Financial summary
    public decimal TotalInvoiced { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalOutstanding { get; set; }

    // Ad spend: sum of Spend across all AdMetrics linked to this client's projects
    public decimal TotalAdSpend { get; set; }
}
