using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EngineApi.Filters;

/// <summary>
/// ERL-4: Request validation; return standard error payload when ModelState is invalid.
/// </summary>
public sealed class RequestValidationFilter : IActionFilter
{
    private const string EngineName = "engine-api";

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ModelState.IsValid)
            return;

        var traceId = context.HttpContext.Items["TraceId"] as string ?? Guid.NewGuid().ToString("N");
        var correlationId = context.HttpContext.Items["CorrelationId"] as string;
        var errors = new List<object>();
        foreach (var kv in context.ModelState)
        {
            if (kv.Value?.Errors.Count > 0)
                foreach (var e in kv.Value.Errors)
                    errors.Add(new { path = kv.Key, message = e.ErrorMessage });
        }

        context.Result = new JsonResult(new
        {
            trace_id = traceId,
            correlation_id = correlationId,
            engine_name = EngineName,
            error_code = "VALIDATION",
            error_type = "ValidationError",
            message = "Request validation failed",
            errors,
            status = 400,
        })
        {
            StatusCode = 400,
        };
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
