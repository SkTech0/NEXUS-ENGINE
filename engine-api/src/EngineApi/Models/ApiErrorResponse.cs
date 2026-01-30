namespace EngineApi.Models;

/// <summary>
/// ERL-4: Standard error response for gateway-level error normalization.
/// </summary>
public record ApiErrorResponse(
    string TraceId,
    string? CorrelationId,
    string EngineName,
    string ErrorCode,
    string ErrorType,
    string Message,
    int Status
);
