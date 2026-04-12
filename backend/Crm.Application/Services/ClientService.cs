using Crm.Application.DTOs.Clients;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Services;

public class ClientService
{
    private readonly IGenericRepository<Client> _repository;
    private readonly IGenericRepository<Project> _projects;
    private readonly IGenericRepository<Lead> _leads;
    private readonly IGenericRepository<Offer> _offers;
    private readonly IGenericRepository<Invoice> _invoices;
    private readonly IGenericRepository<AdMetric> _adMetrics;
    private readonly ICurrentUserContext _currentUserContext;

    public ClientService(
        IGenericRepository<Client> repository,
        IGenericRepository<Project> projects,
        IGenericRepository<Lead> leads,
        IGenericRepository<Offer> offers,
        IGenericRepository<Invoice> invoices,
        IGenericRepository<AdMetric> adMetrics,
        ICurrentUserContext currentUserContext)
    {
        _repository = repository;
        _projects = projects;
        _leads = leads;
        _offers = offers;
        _invoices = invoices;
        _adMetrics = adMetrics;
        _currentUserContext = currentUserContext;
    }

    public async Task<IEnumerable<ClientResponse>> GetAllAsync()
    {
        var clients = await _repository.GetAllAsync();
        return clients.Select(c => new ClientResponse
        {
            Id = c.Id,
            Name = c.Name,
            LegalName = c.LegalName,
            VatNumber = c.VatNumber,
            BusinessAddress = c.BusinessAddress,
            Industry = c.Industry,
            Priority = c.Priority,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<ClientResponse> CreateAsync(CreateClientRequest request)
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            LegalName = request.LegalName,
            VatNumber = request.VatNumber,
            BusinessAddress = request.BusinessAddress,
            Industry = request.Industry,
            Priority = request.Priority,
            TenantId = _currentUserContext.TenantId ?? Guid.Empty
        };

        await _repository.AddAsync(client);
        await _repository.SaveChangesAsync();

        return new ClientResponse
        {
            Id = client.Id,
            Name = client.Name,
            LegalName = client.LegalName,
            VatNumber = client.VatNumber,
            BusinessAddress = client.BusinessAddress,
            Industry = client.Industry,
            Priority = client.Priority,
            CreatedAt = client.CreatedAt
        };
    }

    /// <summary>
    /// Returns aggregated dashboard metrics for a single client.
    /// All queries rely on EF Core global tenant filter — no explicit TenantId filter needed.
    /// Returns null if the client is not found or belongs to another tenant.
    /// </summary>
    public async Task<ClientDashboardDto?> GetDashboardAsync(Guid clientId)
    {
        var client = await _repository.AsQueryable()
            .FirstOrDefaultAsync(c => c.Id == clientId);

        if (client == null) return null;

        // Projects owned by this client
        var clientProjectIds = await _projects.AsQueryable()
            .Where(p => p.ClientId == clientId)
            .Select(p => p.Id)
            .ToListAsync();

        var activeProjectsCount = await _projects.AsQueryable()
            .CountAsync(p => p.ClientId == clientId && p.Status == ProjectStatus.Active);

        // Leads that have been converted to this client
        var openLeadsCount = await _leads.AsQueryable()
            .CountAsync(l => l.ConvertedClientId == clientId &&
                             (l.Status == LeadStatus.New || l.Status == LeadStatus.Contacted || l.Status == LeadStatus.Qualified));

        // Offers tied to leads that converted to this client
        var pendingOffersCount = await _offers.AsQueryable()
            .Where(o => o.Lead != null && o.Lead.ConvertedClientId == clientId)
            .CountAsync(o => o.Status == OfferStatus.Draft || o.Status == OfferStatus.Sent);

        // Invoice financials
        var totalInvoiced = await _invoices.AsQueryable()
            .Where(i => i.ClientId == clientId)
            .SumAsync(i => (decimal?)i.TotalAmount) ?? 0m;

        var totalPaid = await _invoices.AsQueryable()
            .Where(i => i.ClientId == clientId && i.Status == InvoiceStatus.Paid)
            .SumAsync(i => (decimal?)i.TotalAmount) ?? 0m;

        // Ad spend: all AdMetrics across all projects belonging to this client
        var totalAdSpend = clientProjectIds.Any()
            ? await _adMetrics.AsQueryable()
                .Where(m => clientProjectIds.Contains(m.ProjectId))
                .SumAsync(m => (decimal?)m.Spend) ?? 0m
            : 0m;

        return new ClientDashboardDto
        {
            Id = client.Id,
            Name = client.Name,
            LegalName = client.LegalName,
            Industry = client.Industry,
            BusinessAddress = client.BusinessAddress,
            ActiveProjectsCount = activeProjectsCount,
            OpenLeadsCount = openLeadsCount,
            PendingOffersCount = pendingOffersCount,
            TotalInvoiced = totalInvoiced,
            TotalPaid = totalPaid,
            TotalOutstanding = totalInvoiced - totalPaid,
            TotalAdSpend = totalAdSpend
        };
    }
}
