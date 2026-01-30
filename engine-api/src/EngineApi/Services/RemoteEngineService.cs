using System.Net.Http.Json;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Logging;

namespace EngineApi.Services;

/// <summary>Engine service that delegates to the engine-services HTTP API.</summary>
public class RemoteEngineService : IEngineService
{
    private readonly HttpClient _http;
    private readonly ILogger<RemoteEngineService> _logger;

    public RemoteEngineService(IHttpClientFactory factory, ILogger<RemoteEngineService> logger)
    {
        _http = factory.CreateClient("EngineServices");
        _logger = logger;
    }

    public EngineResponseDto GetStatus()
    {
        try
        {
            using var response = _http.GetAsync("api/Engine").GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            return ParseEngineResponse(json);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Engine services HTTP request failed for GetStatus");
            return new EngineResponseDto("error", null, ex.Message);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Engine services request timed out for GetStatus");
            return new EngineResponseDto("error", null, "Request timed out");
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Engine services returned invalid JSON for GetStatus");
            return new EngineResponseDto("error", null, "Invalid response");
        }
    }

    public EngineResponseDto Execute(EngineRequestDto request)
    {
        try
        {
            var body = new { request.Action, request.Parameters };
            using var response = _http.PostAsJsonAsync("api/Engine/execute", body).GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            return ParseEngineResponse(json);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Engine services HTTP request failed for Execute (Action: {Action})", request.Action);
            return new EngineResponseDto("error", null, ex.Message);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Engine services request timed out for Execute (Action: {Action})", request.Action);
            return new EngineResponseDto("error", null, "Request timed out");
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Engine services returned invalid JSON for Execute");
            return new EngineResponseDto("error", null, "Invalid response");
        }
    }

    private static EngineResponseDto ParseEngineResponse(string json)
    {
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        var status = root.TryGetProperty("status", out var s) ? s.GetString() ?? "ok" : "ok";
        object? result = null;
        if (root.TryGetProperty("result", out var r))
            result = JsonSerializer.Deserialize<object>(r.GetRawText());
        var message = root.TryGetProperty("message", out var m) && m.ValueKind != JsonValueKind.Null ? m.GetString() : null;
        return new EngineResponseDto(status, result, message);
    }
}
