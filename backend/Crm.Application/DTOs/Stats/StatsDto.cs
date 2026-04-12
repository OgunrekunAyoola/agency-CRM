namespace Crm.Application.DTOs.Stats;

public class StatsDto
{
    /// <summary>Sum of all paid invoices for the tenant.</summary>
    public decimal TotalRevenue { get; set; }

    /// <summary>Sum of all ad spend across all ad metrics for the tenant.</summary>
    public decimal TotalAdSpend { get; set; }

    /// <summary>Number of projects in Active or InProgress status.</summary>
    public int ActiveProjectsCount { get; set; }

    /// <summary>Total number of clients for the tenant.</summary>
    public int TotalClientsCount { get; set; }

    /// <summary>Number of leads in New or Contacted status (not won/lost).</summary>
    public int ActiveLeadsCount { get; set; }

    /// <summary>Number of offers in Sent or Draft status (not accepted/rejected).</summary>
    public int PendingOffersCount { get; set; }
}
