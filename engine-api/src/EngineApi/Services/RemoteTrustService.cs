using System.Net.Http.Json;
using System.Text.Json;
using EngineApi.DTOs;
using Microsoft.Extensions.Logging;

namespace EngineApi.Services;

/// <summary>Trust service that delegates to the engine-trust HTTP API.</summary>
public class RemoteTrustService : ITrustService
{
    private const string ClientName = "EngineServices";
    private readonly IHttpClientFactory _factory;
    private readonly ILogger<RemoteTrustService> _logger;

    public RemoteTrustService(IHttpClientFactory factory, ILogger<RemoteTrustService> logger)
    {
        _factory = factory;
        _logger = logger;
    }

    public TrustVerifyResponseDto Verify(TrustVerifyRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        try
        {
            var client = _factory.CreateClient(ClientName);
            var body = new { claimType = request.ClaimType, payload = request.Payload };
            using var response = client.PostAsJsonAsync("api/Trust/verify", body).GetAwaiter().GetResult();
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
            var client = _factory.CreateClient(ClientName);
            using var response = client.GetAsync($"api/Trust/score/{Uri.EscapeDataString(entityId)}").GetAwaiter().GetResult();
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

    public string? GetDemoToken()
    {
        try
        {
            var client = _factory.CreateClient(ClientName);
            using var response = client.GetAsync("api/Trust/demo-token").GetAwaiter().GetResult();
            response.EnsureSuccessStatusCode();
            var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.TryGetProperty("token", out var t) && t.ValueKind == System.Text.Json.JsonValueKind.String)
                return t.GetString();
            return null;
        }
        catch
        {
            return null;
        }
    }
}
