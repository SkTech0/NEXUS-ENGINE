namespace EngineApi.Middleware;

/// <summary>
/// API Gateway middleware: routing, request logging, optional aggregation.
/// </summary>
public class ApiGatewayMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiGatewayMiddleware> _logger;

    public ApiGatewayMiddleware(RequestDelegate next, ILogger<ApiGatewayMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation("Gateway: {Method} {Path}", context.Request.Method, context.Request.Path);
        context.Response.Headers.Append("X-Gateway", "engine-api");
        await _next(context);
    }
}

/// <summary>
/// Extension to register API Gateway middleware.
/// </summary>
public static class ApiGatewayExtensions
{
    public static IApplicationBuilder UseApiGateway(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ApiGatewayMiddleware>();
    }
}
