using Microsoft.AspNetCore.Mvc;
using EngineApi.DTOs;
using EngineApi.Services;

namespace EngineApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OptimizationController : ControllerBase
{
    private readonly IOptimizationService _optimizationService;

    public OptimizationController(IOptimizationService optimizationService)
    {
        _optimizationService = optimizationService;
    }

    [HttpPost("optimize")]
    public ActionResult<OptimizationResponseDto> Optimize([FromBody] OptimizationRequestDto? request)
    {
        if (request == null)
            return BadRequest(new { error_code = "VALIDATION", error_type = "ValidationError", message = "Request body is required" });
        var result = _optimizationService.Optimize(request);
        return Ok(result);
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "healthy", service = "optimization" });
}
