using Microsoft.AspNetCore.Mvc;
using EngineApi.DTOs;
using EngineApi.Services;

namespace EngineApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("infer")]
    public ActionResult<AIInferenceResponseDto> Infer([FromBody] AIInferenceRequestDto? request)
    {
        if (request == null)
            return BadRequest(new { error_code = "VALIDATION", error_type = "ValidationError", message = "Request body is required" });
        var result = _aiService.Infer(request);
        return Ok(result);
    }

    [HttpGet("models")]
    public ActionResult<AIModelsResponseDto> ListModels()
    {
        var result = _aiService.ListModels();
        return Ok(result);
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "healthy", service = "ai" });
}
