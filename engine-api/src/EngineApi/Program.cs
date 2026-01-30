using EngineApi.Domain.Loan;
using EngineApi.Middleware;
using EngineApi.Repositories;
using EngineApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
var enginesBaseUrl = config["Engines:BaseUrl"]?.TrimEnd('/');

builder.Services.AddControllers(options =>
{
    options.Filters.Add<EngineApi.Filters.RequestValidationFilter>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddSingleton<IEngineRepository, EngineRepository>();

// Platform services: use remote engine-services when Engines:BaseUrl is set, otherwise in-process stubs
if (!string.IsNullOrEmpty(enginesBaseUrl))
{
    if (!Uri.TryCreate(enginesBaseUrl.TrimEnd('/') + "/", UriKind.Absolute, out var baseUri) || !baseUri.IsAbsoluteUri)
        throw new InvalidOperationException(
            "Engines:BaseUrl must be a valid absolute URL (e.g. http://localhost:5001). Check configuration.");
    builder.Services.AddHttpClient("EngineServices", client => { client.BaseAddress = baseUri; });
    builder.Services.AddScoped<IEngineService, RemoteEngineService>();
    builder.Services.AddScoped<IAIService, RemoteAIService>();
    builder.Services.AddScoped<IOptimizationService, RemoteOptimizationService>();
    builder.Services.AddScoped<IIntelligenceService, RemoteIntelligenceService>();
    builder.Services.AddScoped<ITrustService, TrustService>();
}
else
{
    builder.Services.AddScoped<IEngineService, EngineService>();
    builder.Services.AddScoped<IAIService, AIService>();
    builder.Services.AddScoped<IOptimizationService, OptimizationService>();
    builder.Services.AddScoped<IIntelligenceService, IntelligenceService>();
    builder.Services.AddScoped<ITrustService, TrustService>();
}

// HttpClient for domain to call Trust/health: when Engines:BaseUrl is set, call engine-services; else self
var platformBaseUrl = ResolvePlatformBaseUrl(config, enginesBaseUrl);
builder.Services.AddHttpClient("Platform", client =>
{
    client.BaseAddress = new Uri(platformBaseUrl.TrimEnd('/') + "/");
});

static string ResolvePlatformBaseUrl(IConfiguration config, string? enginesBaseUrl)
{
    if (!string.IsNullOrEmpty(enginesBaseUrl))
        return enginesBaseUrl;
    var loanBase = config["Loan:PlatformBaseUrl"]?.TrimEnd('/');
    if (!string.IsNullOrWhiteSpace(loanBase))
        return loanBase!;
    var apiBase = config["EngineApi:BaseUrl"]?.TrimEnd('/');
    if (!string.IsNullOrWhiteSpace(apiBase))
        return apiBase!;
    var urls = config["ASPNETCORE_URLS"]?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    var first = urls?.FirstOrDefault(u => !string.IsNullOrWhiteSpace(u));
    if (!string.IsNullOrWhiteSpace(first))
        return first!;
    throw new InvalidOperationException(
        "Platform base URL is required when not using remote engines. Set one of: Engines:BaseUrl, Loan:PlatformBaseUrl, EngineApi:BaseUrl, or ASPNETCORE_URLS.");
}

// Domain: Loan module
builder.Services.AddScoped<LoanDecisionService>();

var app = builder.Build();

// ERL-4: Correlation first (so TraceId set for all), then logging, then global exception (catches from pipeline), then gateway
app.UseMiddleware<EngineApi.Middleware.CorrelationIdMiddleware>();
app.UseMiddleware<EngineApi.Middleware.RequestLoggingMiddleware>();
app.UseMiddleware<EngineApi.Middleware.GlobalExceptionMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();

app.UseApiGateway();
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

/// <summary>Entry point for integration tests (WebApplicationFactory).</summary>
public partial class Program { }
