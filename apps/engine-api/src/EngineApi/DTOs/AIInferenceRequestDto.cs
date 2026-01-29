namespace EngineApi.DTOs;

public record AIInferenceRequestDto(string ModelId, IReadOnlyDictionary<string, object?>? Inputs);

public record AIInferenceResponseDto(IReadOnlyDictionary<string, object?> Outputs, double LatencyMs, string ModelId);

public record AIModelsResponseDto(IReadOnlyList<string> ModelIds);
