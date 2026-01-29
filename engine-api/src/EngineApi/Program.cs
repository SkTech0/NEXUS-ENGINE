using EngineApi.Domain.Loan;
using EngineApi.Middleware;
using EngineApi.Repositories;
using EngineApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddSingleton<IEngineRepository, EngineRepository>();

// Platform services (generic; unchanged)
builder.Services.AddScoped<IEngineService, EngineService>();
builder.Services.AddScoped<IIntelligenceService, IntelligenceService>();
builder.Services.AddScoped<IOptimizationService, OptimizationService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<ITrustService, TrustService>();

// HttpClient for domain to call platform Trust/health (no change to Trust API)
builder.Services.AddHttpClient("Platform", (sp, client) =>
{
    var baseUrl = sp.GetRequiredService<IConfiguration>()["Loan:PlatformBaseUrl"]?.TrimEnd('/')
        ?? sp.GetRequiredService<IConfiguration>()["ASPNETCORE_URLS"]?.Split(';').FirstOrDefault()?.Trim()
        ?? "http://localhost:5000";
    client.BaseAddress = new Uri(baseUrl.TrimEnd('/') + "/");
});

// Domain: Loan module
builder.Services.AddScoped<LoanDecisionService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseApiGateway();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

/// <summary>Entry point for integration tests (WebApplicationFactory).</summary>
public partial class Program { }
