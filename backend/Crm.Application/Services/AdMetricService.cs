using Crm.Application.DTOs.AdMetrics;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class AdMetricService
{
    private readonly IGenericRepository<AdMetric> _repository;
    private readonly ICurrentUserContext _currentUserContext;

    public AdMetricService(IGenericRepository<AdMetric> repository, ICurrentUserContext currentUserContext)
    {
        _repository = repository;
        _currentUserContext = currentUserContext;
    }

    public async Task<IEnumerable<AdMetricResponse>> GetProjectMetricsAsync(Guid projectId)
    {
        var metrics = await _repository.GetAllAsync();
        return metrics.Where(m => m.ProjectId == projectId).Select(MapToResponse).ToList();
    }

    public async Task<IEnumerable<AdMetricResponse>> GetAllAsync()
    {
        var metrics = await _repository.GetAllAsync();
        return metrics.Select(MapToResponse).ToList();
    }

    public async Task<AdMetricResponse> CreateAsync(CreateAdMetricRequest request)
    {
        var metric = new AdMetric
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId,
            Platform = request.Platform,
            Spend = request.Spend,
            Impressions = request.Impressions,
            Clicks = request.Clicks,
            Conversions = request.Conversions,
            Date = request.Date,
            TenantId = _currentUserContext.TenantId ?? Guid.Empty
        };

        await _repository.AddAsync(metric);
        await _repository.SaveChangesAsync();

        return MapToResponse(metric);
    }

    private AdMetricResponse MapToResponse(AdMetric m)
    {
        return new AdMetricResponse
        {
            Id = m.Id,
            ProjectId = m.ProjectId,
            Platform = m.Platform,
            Spend = m.Spend,
            Impressions = m.Impressions,
            Clicks = m.Clicks,
            Conversions = m.Conversions,
            Date = m.Date,
            CreatedAt = m.CreatedAt
        };
    }
}
