using Microsoft.AspNetCore.Mvc;

namespace EngineApi.Controllers;

/// <summary>
/// ERL-4: Liveness, readiness, dependency checks.
/// Liveness = process alive. Readiness = ready to accept traffic (dependencies OK).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private const string EngineName = "engine-api";
    private const string EngineVersion = "1.0.0";
    private readonly IHttpClientFactory? _httpClientFactory;
    private readonly IConfiguration _configuration;

    public HealthController(IConfiguration configuration, IHttpClientFactory? httpClientFactory = null)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// Liveness: process is alive. Use for Kubernetes liveness probe.
    /// </summary>
    [HttpGet("live")]
    public IActionResult Liveness() => Ok(new
    {
        status = "healthy",
        service = EngineName,
        version = EngineVersion,
        timestamp = DateTime.UtcNow.ToString("O"),
    });

    /// <summary>
    /// Readiness: ready to accept traffic; optional dependency checks.
    /// Use for Kubernetes readiness probe.
    /// </summary>
    [HttpGet("ready")]
    public async Task<IActionResult> ReadinessAsync(CancellationToken ct = default)
    {
        var checks = new List<HealthCheckItem>();
        var enginesBaseUrl = _configuration["Engines:BaseUrl"]?.TrimEnd('/');

        if (!string.IsNullOrEmpty(enginesBaseUrl) && _httpClientFactory != null)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("EngineServices");
                var response = await client.GetAsync("health", ct).ConfigureAwait(false);
                checks.Add(new HealthCheckItem("engines", response.IsSuccessStatusCode ? "healthy" : "unhealthy", response.StatusCode.ToString()));
            }
            catch (Exception ex)
            {
                checks.Add(new HealthCheckItem("engines", "unhealthy", ex.Message));
            }
        }

        var allHealthy = checks.Count == 0 || checks.TrueForAll(c => c.Status == "healthy");
        var status = allHealthy ? "healthy" : "unhealthy";
        var statusCode = allHealthy ? 200 : 503;

        return StatusCode(statusCode, new
        {
            status,
            service = EngineName,
            version = EngineVersion,
            checks,
            timestamp = DateTime.UtcNow.ToString("O"),
        });
    }

    private record HealthCheckItem(string Name, string Status, string? Message);

    /// <summary>
    /// Legacy /api/Health: returns OK for backward compatibility; same as liveness.
    /// </summary>
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        status = "healthy",
        service = EngineName,
        timestamp = DateTime.UtcNow.ToString("O"),
    });
}
