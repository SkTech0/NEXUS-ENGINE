namespace EngineApi.DTOs;

public record EngineRequestDto(string? Action, IReadOnlyDictionary<string, object?>? Parameters);

public record EngineResponseDto(string Status, object? Result, string? Message);
