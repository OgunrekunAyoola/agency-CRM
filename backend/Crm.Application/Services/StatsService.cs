using Crm.Application.DTOs.Stats;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Services;

public class StatsService : IStatsService
{
    private readonly IGenericRepository<Client> _clients;
    private readonly IGenericRepository<Lead> _leads;
    private readonly IGenericRepository<Offer> _offers;
    private readonly IGenericRepository<Project> _projects;
    private readonly IGenericRepository<Invoice> _invoices;
    private readonly IGenericRepository<AdMetric> _adMetrics;

    public StatsService(
        IGenericRepository<Client> clients,
        IGenericRepository<Lead> leads,
        IGenericRepository<Offer> offers,
        IGenericRepository<Project> projects,
        IGenericRepository<Invoice> invoices,
        IGenericRepository<AdMetric> adMetrics)
    {
        _clients = clients;
        _leads = leads;
        _offers = offers;
        _projects = projects;
        _invoices = invoices;
        _adMetrics = adMetrics;
    }

    public async Task<StatsDto> GetStatsAsync()
    {
        // All queries rely on the EF Core global query filter (TenantId == CurrentTenantId).
        // No extra tenant filtering is needed here — it is enforced at the DB context level.

        var totalRevenue = await _invoices
            .AsQueryable()
            .Where(i => i.Status == InvoiceStatus.Paid)
            .SumAsync(i => (decimal?)i.TotalAmount) ?? 0m;

        var totalAdSpend = await _adMetrics
            .AsQueryable()
            .SumAsync(m => (decimal?)m.Spend) ?? 0m;

        var activeProjectsCount = await _projects
            .AsQueryable()
            .CountAsync(p => p.Status == ProjectStatus.Active);

        var totalClientsCount = await _clients
            .AsQueryable()
            .CountAsync();

        var activeLeadsCount = await _leads
            .AsQueryable()
            .CountAsync(l => l.Status == LeadStatus.New || l.Status == LeadStatus.Contacted || l.Status == LeadStatus.Qualified);

        var pendingOffersCount = await _offers
            .AsQueryable()
            .CountAsync(o => o.Status == OfferStatus.Draft || o.Status == OfferStatus.Sent);

        return new StatsDto
        {
            TotalRevenue = totalRevenue,
            TotalAdSpend = totalAdSpend,
            ActiveProjectsCount = activeProjectsCount,
            TotalClientsCount = totalClientsCount,
            ActiveLeadsCount = activeLeadsCount,
            PendingOffersCount = pendingOffersCount
        };
    }
}
