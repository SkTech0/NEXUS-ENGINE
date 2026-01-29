using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace EngineApi.Tests;

public class EngineApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public EngineApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_Returns_200_And_Healthy()
    {
        var res = await _client.GetAsync("/api/Health");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("status").GetString().Should().Be("healthy");
        json.GetProperty("service").GetString().Should().Be("engine-api");
    }

    [Fact]
    public async Task Engine_Get_Returns_200()
    {
        var res = await _client.GetAsync("/api/Engine");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("status").GetString().Should().Be("ok");
    }

    [Fact]
    public async Task Engine_Execute_Returns_200()
    {
        var body = new { action = "push", parameters = new { source = "integration-test" } };
        var res = await _client.PostAsJsonAsync("/api/Engine/execute", body);
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("status").GetString().Should().Be("ok");
    }

    [Fact]
    public async Task Intelligence_Evaluate_Returns_200()
    {
        var body = new { context = "test", inputs = new Dictionary<string, object> { ["k"] = "v" } };
        var res = await _client.PostAsJsonAsync("/api/Intelligence/evaluate", body);
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("outcome").GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Optimization_Optimize_Returns_200()
    {
        var body = new { targetId = "t1", objective = "minimize", constraints = new Dictionary<string, double>() };
        var res = await _client.PostAsJsonAsync("/api/Optimization/optimize", body);
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("targetId").GetString().Should().NotBeNullOrEmpty();
        json.GetProperty("feasible").GetBoolean().Should().BeTrue();
    }

    [Fact]
    public async Task AI_Infer_Returns_200()
    {
        var body = new { modelId = "default", inputs = new Dictionary<string, object> { ["x"] = 1 } };
        var res = await _client.PostAsJsonAsync("/api/AI/infer", body);
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        json.TryGetProperty("outputs", out _).Should().BeTrue();
        json.GetProperty("modelId").GetString().Should().Be("default");
    }

    [Fact]
    public async Task Trust_Health_Returns_200()
    {
        var res = await _client.GetAsync("/api/Trust/health");
        res.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Gateway_Adds_XGateway_Header()
    {
        var res = await _client.GetAsync("/api/Health");
        res.Headers.TryGetValues("X-Gateway", out var values).Should().BeTrue();
        values!.FirstOrDefault().Should().Be("engine-api");
    }
}
