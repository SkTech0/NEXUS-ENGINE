using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace EngineApi.Middleware;

/// <summary>
/// ERL-4: Global exception handling; unified error mapping; non-crashing failure handling.
/// Returns standard error payload: trace_id, engine_name, error_code, error_type, message.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private const string EngineName = "engine-api";

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var traceId = context.Items["TraceId"] as string ?? Guid.NewGuid().ToString("N");
        var correlationId = context.Items["CorrelationId"] as string;

        var (statusCode, code, type) = MapException(ex);
        var payload = new
        {
            trace_id = traceId,
            correlation_id = correlationId,
            engine_name = EngineName,
            error_code = code,
            error_type = type,
            message = ex.Message,
            status = statusCode,
        };

        _logger.LogError(ex, "ERL-4 error: {TraceId} {Code} {Type} {Message}", traceId, code, type, ex.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }

    private static (HttpStatusCode status, string code, string type) MapException(Exception ex)
    {
        return ex switch
        {
            ArgumentException => (HttpStatusCode.BadRequest, "VALIDATION", "ValidationError"),
            InvalidOperationException => (HttpStatusCode.BadRequest, "ENGINE", "EngineError"),
            KeyNotFoundException => (HttpStatusCode.NotFound, "ENGINE", "EngineError"),
            TaskCanceledException => (HttpStatusCode.RequestTimeout, "TIMEOUT", "TimeoutError"),
            OperationCanceledException => (HttpStatusCode.RequestTimeout, "TIMEOUT", "TimeoutError"),
            HttpRequestException => (HttpStatusCode.BadGateway, "DEPENDENCY", "DependencyError"),
            _ => (HttpStatusCode.InternalServerError, "EXECUTION", "ExecutionError"),
        };
    }
}
