using Crm.Application.DTOs.Projects;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class ProjectService
{
    private readonly IGenericRepository<Project> _repository;
    private readonly ICurrentUserContext _currentUserContext;

    public ProjectService(IGenericRepository<Project> repository, ICurrentUserContext currentUserContext)
    {
        _repository = repository;
        _currentUserContext = currentUserContext;
    }

    public async Task<IEnumerable<ProjectResponse>> GetAllAsync()
    {
        var projects = await _repository.GetAllAsync();
        return projects.Select(p => new ProjectResponse
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Status = p.Status,
            ClientId = p.ClientId,
            CreatedAt = p.CreatedAt
        });
    }

    public async Task<ProjectResponse?> GetByIdAsync(Guid id)
    {
        var project = await _repository.GetByIdAsync(id);
        if (project == null) return null;

        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status,
            ClientId = project.ClientId,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<ProjectResponse> CreateAsync(CreateProjectRequest request)
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name ?? string.Empty,
            Description = request.Description ?? string.Empty,
            ClientId = request.ClientId,
            OfferId = request.OfferId,
            TenantId = _currentUserContext.TenantId ?? Guid.Empty
        };

        await _repository.AddAsync(project);
        await _repository.SaveChangesAsync();

        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status,
            ClientId = project.ClientId,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<ProjectResponse?> UpdateAsync(Guid id, UpdateProjectRequest request)
    {
        var project = await _repository.GetByIdAsync(id);
        if (project == null) return null;

        if (request.Name != null) project.Name = request.Name;
        if (request.Description != null) project.Description = request.Description;
        if (request.Status.HasValue) project.Status = request.Status.Value;
        if (request.ClientId.HasValue) project.ClientId = request.ClientId;

        await _repository.SaveChangesAsync();

        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status,
            ClientId = project.ClientId,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var project = await _repository.GetByIdAsync(id);
        if (project == null) return false;

        _repository.Delete(project);
        await _repository.SaveChangesAsync();
        return true;
    }
}
