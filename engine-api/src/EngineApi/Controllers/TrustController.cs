using Microsoft.AspNetCore.Mvc;
using EngineApi.DTOs;
using EngineApi.Services;

namespace EngineApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrustController : ControllerBase
{
    private readonly ITrustService _trustService;

    public TrustController(ITrustService trustService)
    {
        _trustService = trustService;
    }

    [HttpPost("verify")]
    public ActionResult<TrustVerifyResponseDto> Verify([FromBody] TrustVerifyRequestDto? request)
    {
        if (request == null)
            return BadRequest(new { error_code = "VALIDATION", error_type = "ValidationError", message = "Request body is required" });
        var result = _trustService.Verify(request);
        return Ok(result);
    }

    [HttpGet("score/{entityId}")]
    public ActionResult<TrustScoreResponseDto> GetScore(string entityId)
    {
        if (string.IsNullOrWhiteSpace(entityId))
            return BadRequest(new { error_code = "VALIDATION", error_type = "ValidationError", message = "entityId is required" });
        var result = _trustService.GetScore(entityId);
        return Ok(result);
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "healthy", service = "trust" });
}
