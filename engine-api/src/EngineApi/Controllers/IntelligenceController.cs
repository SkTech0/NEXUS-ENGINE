using Microsoft.AspNetCore.Mvc;
using EngineApi.DTOs;
using EngineApi.Services;

namespace EngineApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IntelligenceController : ControllerBase
{
    private readonly IIntelligenceService _intelligenceService;

    public IntelligenceController(IIntelligenceService intelligenceService)
    {
        _intelligenceService = intelligenceService;
    }

    [HttpPost("evaluate")]
    public ActionResult<IntelligenceResponseDto> Evaluate([FromBody] IntelligenceRequestDto? request)
    {
        if (request == null)
            return BadRequest(new { error_code = "VALIDATION", error_type = "ValidationError", message = "Request body is required" });
        var result = _intelligenceService.Evaluate(request);
        return Ok(result);
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "healthy", service = "intelligence" });
}
