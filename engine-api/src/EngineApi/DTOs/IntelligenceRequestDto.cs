namespace EngineApi.DTOs;

public record IntelligenceRequestDto(string? Context, IReadOnlyDictionary<string, object?>? Inputs);

public record IntelligenceResponseDto(string Outcome, double Confidence, object? Payload);
