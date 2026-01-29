namespace EngineApi.DTOs;

public record OptimizationRequestDto(string? TargetId, string? Objective, IReadOnlyDictionary<string, double>? Constraints);

public record OptimizationResponseDto(string TargetId, double Value, bool Feasible);
