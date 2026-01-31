using EngineApi.Domain.Loan;
using EngineApi.Middleware;
using EngineApi.Repositories;
using EngineApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Env vars → per-engine BaseUrl (Railway / platform mode). ENGINES_AI_BASE_URL etc.
var envConfig = new List<KeyValuePair<string, string?>>();
void AddEnv(string envKey, string configKey) { var v = Environment.GetEnvironmentVariable(envKey); if (!string.IsNullOrWhiteSpace(v)) envConfig.Add(new KeyValuePair<string, string?>(configKey, v)); }
AddEnv("ENGINES_AI_BASE_URL", "Engines:AI:BaseUrl");
AddEnv("ENGINES_INTELLIGENCE_BASE_URL", "Engines:Intelligence:BaseUrl");
AddEnv("ENGINES_TRUST_BASE_URL", "Engines:Trust:BaseUrl");
AddEnv("ENGINES_DATA_BASE_URL", "Engines:Data:BaseUrl");
AddEnv("ENGINES_OPTIMIZATION_BASE_URL", "Engines:Optimization:BaseUrl");
AddEnv("ENGINES_DISTRIBUTED_BASE_URL", "Engines:Distributed:BaseUrl");
if (envConfig.Count == 6)
{
    var trustUrl = Environment.GetEnvironmentVariable("ENGINES_TRUST_BASE_URL");
    if (!string.IsNullOrWhiteSpace(trustUrl))
        envConfig.Add(new KeyValuePair<string, string?>("Engines:BaseUrl", trustUrl));
}
if (envConfig.Count > 0)
    builder.Configuration.AddInMemoryCollection(envConfig);

var config = builder.Configuration;

var enginesBaseUrl = config["Engines:BaseUrl"]?.TrimEnd('/');
var aiBase = config["Engines:AI:BaseUrl"]?.TrimEnd('/');
var intelligenceBase = config["Engines:Intelligence:BaseUrl"]?.TrimEnd('/');
var trustBase = config["Engines:Trust:BaseUrl"]?.TrimEnd('/');
var dataBase = config["Engines:Data:BaseUrl"]?.TrimEnd('/');
var optimizationBase = config["Engines:Optimization:BaseUrl"]?.TrimEnd('/');
var distributedBase = config["Engines:Distributed:BaseUrl"]?.TrimEnd('/');

var platformMode = !string.IsNullOrEmpty(aiBase) && !string.IsNullOrEmpty(intelligenceBase) && !string.IsNullOrEmpty(trustBase)
    && !string.IsNullOrEmpty(dataBase) && !string.IsNullOrEmpty(optimizationBase) && !string.IsNullOrEmpty(distributedBase);

// Trim URLs to avoid invalid URIs from trailing/leading whitespace (common in env vars)
static string? TrimUrl(string? u) => u?.Trim();
aiBase = TrimUrl(aiBase);
intelligenceBase = TrimUrl(intelligenceBase);
trustBase = TrimUrl(trustBase);
dataBase = TrimUrl(dataBase);
optimizationBase = TrimUrl(optimizationBase);
distributedBase = TrimUrl(distributedBase);

builder.Services.AddControllers(options =>
{
    options.Filters.Add<EngineApi.Filters.RequestValidationFilter>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddSingleton<IEngineRepository, EngineRepository>();

// Gateway: platform mode (per-engine URLs) or legacy (single Engines:BaseUrl) or in-process stubs
if (platformMode)
{
    builder.Services.AddHttpClient("EngineServices", client => client.BaseAddress = new Uri(trustBase!.TrimEnd('/') + "/"));
    builder.Services.AddHttpClient<RemoteAIService>(client => client.BaseAddress = new Uri(aiBase!.TrimEnd('/') + "/"));
    builder.Services.AddScoped<IAIService, RemoteAIService>();
    builder.Services.AddHttpClient<RemoteIntelligenceService>(client => client.BaseAddress = new Uri(intelligenceBase!.TrimEnd('/') + "/"));
    builder.Services.AddScoped<IIntelligenceService, RemoteIntelligenceService>();
    builder.Services.AddHttpClient<RemoteEngineService>(client => client.BaseAddress = new Uri(intelligenceBase!.TrimEnd('/') + "/"));
    builder.Services.AddScoped<IEngineService, RemoteEngineService>();
    builder.Services.AddHttpClient<RemoteOptimizationService>(client => client.BaseAddress = new Uri(optimizationBase!.TrimEnd('/') + "/"));
    builder.Services.AddScoped<IOptimizationService, RemoteOptimizationService>();
    builder.Services.AddHttpClient<RemoteTrustService>(client => client.BaseAddress = new Uri(trustBase!.TrimEnd('/') + "/"));
    builder.Services.AddScoped<ITrustService, RemoteTrustService>();
}
else if (!string.IsNullOrEmpty(enginesBaseUrl))
{
    if (!Uri.TryCreate(enginesBaseUrl.TrimEnd('/') + "/", UriKind.Absolute, out var baseUri) || !baseUri.IsAbsoluteUri)
        throw new InvalidOperationException(
            "Engines:BaseUrl must be a valid absolute URL (e.g. http://localhost:5001). Check configuration.");
    builder.Services.AddHttpClient<RemoteAIService>(client => client.BaseAddress = baseUri);
    builder.Services.AddScoped<IAIService, RemoteAIService>();
    builder.Services.AddHttpClient<RemoteIntelligenceService>(client => client.BaseAddress = baseUri);
    builder.Services.AddScoped<IIntelligenceService, RemoteIntelligenceService>();
    builder.Services.AddHttpClient<RemoteEngineService>(client => client.BaseAddress = baseUri);
    builder.Services.AddScoped<IEngineService, RemoteEngineService>();
    builder.Services.AddHttpClient<RemoteOptimizationService>(client => client.BaseAddress = baseUri);
    builder.Services.AddScoped<IOptimizationService, RemoteOptimizationService>();
    builder.Services.AddHttpClient<RemoteTrustService>(client => client.BaseAddress = baseUri);
    builder.Services.AddScoped<ITrustService, RemoteTrustService>();
}
else
{
    builder.Services.AddScoped<IEngineService, EngineService>();
    builder.Services.AddScoped<IAIService, AIService>();
    builder.Services.AddScoped<IOptimizationService, OptimizationService>();
    builder.Services.AddScoped<IIntelligenceService, IntelligenceService>();
    builder.Services.AddScoped<ITrustService, TrustService>();
}


// HttpClient for domain to call Trust/health: platform mode → trust service; legacy → single BaseUrl; else self
var platformBaseUrl = platformMode ? trustBase! : ResolvePlatformBaseUrl(config, enginesBaseUrl);
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

// Log engine config at startup (no URLs to avoid secrets in logs)
var logFactory = app.Services.GetRequiredService<Microsoft.Extensions.Logging.ILoggerFactory>();
var log = logFactory.CreateLogger("Startup");
log.LogInformation("Engine config: PlatformMode={PlatformMode}, EnginesLoaded={Count}",
    platformMode, envConfig.Count);

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
