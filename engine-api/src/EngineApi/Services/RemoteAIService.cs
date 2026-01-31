using System.Linq;
using System.Net.Http.Json;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Logging;

namespace EngineApi.Services;

/// <summary>AI service that delegates to the engine-ai HTTP API.</summary>
public class RemoteAIService : IAIService
{
    private const string ClientName = "AIService";
    private readonly IHttpClientFactory _factory;
    private readonly ILogger<RemoteAIService> _logger;

    public RemoteAIService(IHttpClientFactory factory, ILogger<RemoteAIService> logger)
    {
        _factory = factory;
        _logger = logger;
    }

    public AIInferenceResponseDto Infer(AIInferenceRequestDto request)
    {
        try
        {
            var client = _factory.CreateClient(ClientName);
            var body = new { modelId = request.ModelId, inputs = request.Inputs };
            using var response = client.PostAsJsonAsync("api/AI/infer", body).GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            return ParseInferResponse(json, request.ModelId);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "AI services HTTP request failed for Infer (ModelId: {ModelId})", request.ModelId);
            return new AIInferenceResponseDto(new Dictionary<string, object?>(), 0.0, request.ModelId);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "AI services request timed out for Infer (ModelId: {ModelId})", request.ModelId);
            return new AIInferenceResponseDto(new Dictionary<string, object?>(), 0.0, request.ModelId);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "AI services returned invalid JSON for Infer");
            return new AIInferenceResponseDto(new Dictionary<string, object?>(), 0.0, request.ModelId);
        }
    }

    public AIModelsResponseDto ListModels()
    {
        try
        {
            var client = _factory.CreateClient(ClientName);
            using var response = client.GetAsync("api/AI/models").GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            using var doc = JsonDocument.Parse(json);
            var ids = doc.RootElement.TryGetProperty("modelIds", out var arr)
                ? arr.EnumerateArray().Select(e => e.GetString() ?? "").ToList()
                : new List<string> { "default" };
            return new AIModelsResponseDto(ids);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "AI services HTTP request failed for ListModels");
            return new AIModelsResponseDto(new List<string> { "default" });
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "AI services request timed out for ListModels");
            return new AIModelsResponseDto(new List<string> { "default" });
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "AI services returned invalid JSON for ListModels");
            return new AIModelsResponseDto(new List<string> { "default" });
        }
    }

    private static AIInferenceResponseDto ParseInferResponse(string json, string modelId)
    {
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        var outputs = root.TryGetProperty("outputs", out var o)
            ? JsonSerializer.Deserialize<Dictionary<string, object?>>(o.GetRawText()) ?? new Dictionary<string, object?>()
            : new Dictionary<string, object?>();
        var dict = new Dictionary<string, object?>();
        if (outputs != null)
            foreach (var kv in outputs)
                dict[kv.Key] = kv.Value;
        var latency = root.TryGetProperty("latencyMs", out var l) ? l.GetDouble() : 0.0;
        var mid = root.TryGetProperty("modelId", out var m) ? m.GetString() ?? modelId : modelId;
        return new AIInferenceResponseDto(dict, latency, mid);
    }
}
