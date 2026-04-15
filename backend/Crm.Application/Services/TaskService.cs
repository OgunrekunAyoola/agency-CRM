using Crm.Application.DTOs.Tasks;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class TaskService
{
    private readonly IGenericRepository<CrmTask> _repository;

    public TaskService(IGenericRepository<CrmTask> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TaskResponse>> GetAllAsync()
    {
        var tasks = await _repository.GetAllAsync();
        return tasks.Select(t => new TaskResponse
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Status = t.Status,
            Priority = t.Priority,
            StartDate = t.StartDate,
            DueDate = t.DueDate,
            ProjectId = t.ProjectId,
            CreatedAt = t.CreatedAt
        }).ToList();
    }

    public async Task<TaskResponse?> GetByIdAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null) return null;

        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            CreatedAt = task.CreatedAt
        };
    }

    public async Task<TaskResponse> CreateAsync(CreateTaskRequest request)
    {
        var task = new CrmTask
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId ?? Guid.Empty,
            StartDate = request.StartDate ?? DateTime.UtcNow,
            DueDate = request.DueDate
        };

        await _repository.AddAsync(task);
        await _repository.SaveChangesAsync();

        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            CreatedAt = task.CreatedAt
        };
    }

    public async Task<TaskResponse?> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null) return null;

        if (request.Title != null) task.Title = request.Title;
        if (request.Description != null) task.Description = request.Description;
        if (request.Status != null) task.Status = request.Status;
        if (request.Priority != null) task.Priority = request.Priority;
        if (request.StartDate.HasValue) task.StartDate = request.StartDate.Value;
        if (request.DueDate.HasValue) task.DueDate = request.DueDate;

        await _repository.SaveChangesAsync();

        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            CreatedAt = task.CreatedAt
        };
    }

    public async Task<TaskResponse?> UpdateStatusAsync(Guid id, string status)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null) return null;

        task.Status = status;
        await _repository.SaveChangesAsync();

        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            StartDate = task.StartDate,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            CreatedAt = task.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task == null) return false;

        _repository.Delete(task);
        await _repository.SaveChangesAsync();
        return true;
    }
}
