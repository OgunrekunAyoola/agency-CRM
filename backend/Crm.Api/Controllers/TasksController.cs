using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Crm.Application.Services;
using Crm.Application.DTOs.Tasks;

namespace Crm.Api.Controllers;

[Authorize(Roles = "Admin,ProjectManager")]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly TaskService _taskService;

    public TasksController(TaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetTasks()
    {
        var tasks = await _taskService.GetAllAsync();
        return Ok(tasks);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> GetTask(Guid id)
    {
        var task = await _taskService.GetByIdAsync(id);
        if (task == null) return NotFound();
        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateTask(CreateTaskRequest request)
    {
        var response = await _taskService.CreateAsync(request);
        return CreatedAtAction(nameof(GetTask), new { id = response.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request)
    {
        var response = await _taskService.UpdateAsync(id, request);
        if (response == null) return NotFound();
        return Ok(response);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<TaskResponse>> UpdateTaskStatus(Guid id, [FromBody] UpdateTaskStatusRequest request)
    {
        var response = await _taskService.UpdateStatusAsync(id, request.Status);
        if (response == null) return NotFound();
        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var deleted = await _taskService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
