using System.Diagnostics;

namespace EngineApi.Middleware;

/// <summary>
/// ERL-4: Correlation ID and Trace ID propagation.
/// Reads X-Correlation-Id / X-Trace-Id from request or generates new; sets on response.
/// </summary>
public class CorrelationIdMiddleware
{
    private const string CorrelationIdHeader = "X-Correlation-Id";
    private const string TraceIdHeader = "X-Trace-Id";
    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()
            ?? Guid.NewGuid().ToString("N");
        var traceId = context.Request.Headers[TraceIdHeader].FirstOrDefault()
            ?? Activity.Current?.Id ?? Guid.NewGuid().ToString("N");

        context.Response.Headers.Append(CorrelationIdHeader, correlationId);
        context.Response.Headers.Append(TraceIdHeader, traceId);
        context.Items["CorrelationId"] = correlationId;
        context.Items["TraceId"] = traceId;

        await _next(context);
    }
}
