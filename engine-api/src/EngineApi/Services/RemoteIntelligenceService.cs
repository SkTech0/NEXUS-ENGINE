using System.Net.Http.Json;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Logging;

namespace EngineApi.Services;

/// <summary>Intelligence service that delegates to the engine-intelligence HTTP API.</summary>
public class RemoteIntelligenceService : IIntelligenceService
{
    private readonly HttpClient _http;
    private readonly ILogger<RemoteIntelligenceService> _logger;

    public RemoteIntelligenceService(HttpClient http, ILogger<RemoteIntelligenceService> logger)
    {
        _http = http;
        _logger = logger;
    }

    public IntelligenceResponseDto Evaluate(IntelligenceRequestDto request)
    {
        try
        {
            var body = new { context = request.Context, inputs = request.Inputs };
            using var response = _http.PostAsJsonAsync("api/Intelligence/evaluate", body).GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            var outcome = root.TryGetProperty("outcome", out var o) ? o.GetString() ?? "evaluated" : "evaluated";
            var confidence = root.TryGetProperty("confidence", out var c) ? c.GetDouble() : 0.0;
            object? payload = null;
            if (root.TryGetProperty("payload", out var p) && p.ValueKind != JsonValueKind.Null)
                payload = JsonSerializer.Deserialize<object>(p.GetRawText());
            return new IntelligenceResponseDto(outcome ?? "evaluated", confidence, payload);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Intelligence services HTTP request failed for Evaluate (Context: {Context})", request.Context);
            return new IntelligenceResponseDto("evaluated", 0.0, request.Inputs);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Intelligence services request timed out for Evaluate (Context: {Context})", request.Context);
            return new IntelligenceResponseDto("evaluated", 0.0, request.Inputs);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Intelligence services returned invalid JSON for Evaluate");
            return new IntelligenceResponseDto("evaluated", 0.0, request.Inputs);
        }
    }
}
