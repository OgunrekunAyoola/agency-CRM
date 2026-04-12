using Crm.Application.DTOs.Stats;

namespace Crm.Application.Interfaces;

public interface IStatsService
{
    /// <summary>
    /// Returns a single aggregated stats object for the current tenant.
    /// All counts and sums are scoped to the calling user's tenant_id via
    /// the EF Core global query filter — no additional filtering needed here.
    /// </summary>
    Task<StatsDto> GetStatsAsync();
}
