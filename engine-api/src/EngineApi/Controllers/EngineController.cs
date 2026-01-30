using Microsoft.AspNetCore.Mvc;
using EngineApi.DTOs;
using EngineApi.Services;

namespace EngineApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EngineController : ControllerBase
{
    private readonly IEngineService _engineService;

    public EngineController(IEngineService engineService)
    {
        _engineService = engineService;
    }

    [HttpGet]
    public ActionResult<EngineResponseDto> GetStatus()
    {
        var result = _engineService.GetStatus();
        return Ok(result);
    }

    [HttpPost("execute")]
    public ActionResult<EngineResponseDto> Execute([FromBody] EngineRequestDto? request)
    {
        if (request == null)
            return BadRequest(new { error_code = "VALIDATION", error_type = "ValidationError", message = "Request body is required" });
        var result = _engineService.Execute(request);
        return Ok(result);
    }
}
