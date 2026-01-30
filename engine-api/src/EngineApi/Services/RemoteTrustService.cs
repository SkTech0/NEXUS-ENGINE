using System.Net.Http.Json;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Logging;

namespace EngineApi.Services;

/// <summary>Trust service that delegates to the engine-trust HTTP API.</summary>
public class RemoteTrustService : ITrustService
{
    private readonly HttpClient _http;
    private readonly ILogger<RemoteTrustService> _logger;

    public RemoteTrustService(HttpClient http, ILogger<RemoteTrustService> logger)
    {
        _http = http;
        _logger = logger;
    }

    public TrustVerifyResponseDto Verify(TrustVerifyRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        try
        {
            var body = new { claimType = request.ClaimType, payload = request.Payload };
            using var response = _http.PostAsJsonAsync("api/Trust/verify", body).GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            var valid = root.TryGetProperty("valid", out var v) && v.GetBoolean();
            var message = root.TryGetProperty("message", out var m) ? m.GetString() : null;
            return new TrustVerifyResponseDto(valid, message);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Trust service HTTP request failed for Verify");
            return new TrustVerifyResponseDto(Valid: false, Message: ex.Message);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Trust service request timed out for Verify");
            return new TrustVerifyResponseDto(Valid: false, Message: "Request timed out");
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Trust service returned invalid JSON for Verify");
            return new TrustVerifyResponseDto(Valid: false, Message: "Invalid response");
        }
    }

    public TrustScoreResponseDto GetScore(string entityId)
    {
        if (string.IsNullOrWhiteSpace(entityId))
            throw new ArgumentException("entityId is required", nameof(entityId));
        try
        {
            using var response = _http.GetAsync($"api/Trust/score/{Uri.EscapeDataString(entityId)}").GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            var eid = root.TryGetProperty("entityId", out var e) ? e.GetString() ?? entityId : entityId;
            var score = root.TryGetProperty("score", out var s) ? s.GetDouble() : 0.0;
            var source = root.TryGetProperty("source", out var src) ? src.GetString() : null;
            return new TrustScoreResponseDto(eid, score, source);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "Trust service HTTP request failed for GetScore (EntityId: {EntityId})", entityId);
            return new TrustScoreResponseDto(entityId, 0.0, null);
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "Trust service request timed out for GetScore (EntityId: {EntityId})", entityId);
            return new TrustScoreResponseDto(entityId, 0.0, null);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Trust service returned invalid JSON for GetScore");
            return new TrustScoreResponseDto(entityId, 0.0, null);
        }
    }
}
