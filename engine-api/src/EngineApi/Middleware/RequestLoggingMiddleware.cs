using System.Diagnostics;

namespace EngineApi.Middleware;

/// <summary>
/// ERL-4: Structured request logging with trace_id, operation, latency_ms, status.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;
    private const string EngineName = "engine-api";
    private const string EngineVersion = "1.0.0";

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var traceId = context.Items["TraceId"] as string ?? Guid.NewGuid().ToString("N");
        var correlationId = context.Items["CorrelationId"] as string;
        var operation = $"{context.Request.Method} {context.Request.Path}";
        var sw = Stopwatch.StartNew();

        try
        {
            await _next(context);
            sw.Stop();
            var status = context.Response.StatusCode >= 400 ? "error" : "ok";
            _logger.LogInformation(
                "ERL-4 log: trace_id={TraceId} engine_name={EngineName} engine_version={EngineVersion} operation={Operation} status={Status} latency_ms={LatencyMs}",
                traceId, EngineName, EngineVersion, operation, status, sw.ElapsedMilliseconds);
        }
        catch (Exception)
        {
            sw.Stop();
            _logger.LogWarning(
                "ERL-4 log: trace_id={TraceId} operation={Operation} status=error latency_ms={LatencyMs}",
                traceId, operation, sw.ElapsedMilliseconds);
            throw;
        }
    }
}
