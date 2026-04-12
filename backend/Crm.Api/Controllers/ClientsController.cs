using Crm.Application.DTOs.Clients;
using Crm.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[Authorize(Roles = "Admin,SalesManager,ProjectManager")]
[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly ClientService _clientService;
    private readonly ILogger<ClientsController> _logger;

    public ClientsController(ClientService clientService, ILogger<ClientsController> logger)
    {
        _clientService = clientService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientResponse>>> GetClients()
    {
        var clients = await _clientService.GetAllAsync();
        return Ok(clients);
    }

    [HttpPost]
    public async Task<ActionResult<ClientResponse>> CreateClient(CreateClientRequest request)
    {
        _logger.LogInformation("Creating new client: {Name}", request.Name);
        var response = await _clientService.CreateAsync(request);
        _logger.LogInformation("Client created successfully with ID: {Id}", response.Id);
        return CreatedAtAction(nameof(GetClients), new { id = response.Id }, response);
    }

    [HttpGet("{id:guid}/dashboard")]
    public async Task<ActionResult<ClientDashboardDto>> GetClientDashboard(Guid id)
    {
        var dashboard = await _clientService.GetDashboardAsync(id);
        if (dashboard == null) return NotFound();
        return Ok(dashboard);
    }
}
