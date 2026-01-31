using System.Net.Http.Json;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Logging;

namespace EngineApi.Services;

/// <summary>Optimization service that delegates to the engine-optimization HTTP API.</summary>
public class RemoteOptimizationService : IOptimizationService
{
    private const string ClientName = "OptimizationService";
    private readonly IHttpClientFactory _factory;
    private readonly ILogger<RemoteOptimizationService> _logger;

    public RemoteOptimizationService(IHttpClientFactory factory, ILogger<RemoteOptimizationService> logger)
    {
        _factory = factory;
        _logger = logger;
    }

    public OptimizationResponseDto Optimize(OptimizationRequestDto request)
    {
        try
        {
            var client = _factory.CreateClient(ClientName);
            var body = new { request.TargetId, request.Objective, request.Constraints };
            using var response = client.PostAsJsonAsync("api/Optimization/optimize", body).GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            var targetId = root.TryGetProperty("targetId", out var t) ? t.GetString() ?? request.TargetId ?? "default" : request.TargetId ?? "default";
            var value = root.TryGetProperty("value", out var v) ? v.GetDouble() : 0.0;
            var feasible = root.TryGetProperty("feasible", out var f) && f.GetBoolean();
            return new OptimizationResponseDto(targetId ?? "default", value, feasible);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Optimization services HTTP request failed for Optimize (TargetId: {TargetId})", request.TargetId);
            return new OptimizationResponseDto(request.TargetId ?? "default", 0.0, false);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Optimization services request timed out for Optimize (TargetId: {TargetId})", request.TargetId);
            return new OptimizationResponseDto(request.TargetId ?? "default", 0.0, false);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Optimization services returned invalid JSON for Optimize");
            return new OptimizationResponseDto(request.TargetId ?? "default", 0.0, false);
        }
    }
}
