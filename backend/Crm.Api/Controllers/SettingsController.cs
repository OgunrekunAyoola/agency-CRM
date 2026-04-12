using Crm.Application.DTOs.Settings;
using Crm.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet("organization")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetOrganizationSettings()
    {
        var settings = await _settingsService.GetOrganizationSettingsAsync();
        return Ok(settings);
    }

    [HttpPatch("organization")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrganizationSettings([FromBody] UpdateOrganizationSettingsDto dto)
    {
        var updated = await _settingsService.UpdateOrganizationSettingsAsync(dto);
        return Ok(updated);
    }
}
