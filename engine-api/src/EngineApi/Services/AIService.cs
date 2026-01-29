using EngineApi.DTOs;

namespace EngineApi.Services;

public class AIService : IAIService
{
    private static readonly List<string> DefaultModels = new() { "default" };

    public AIInferenceResponseDto Infer(AIInferenceRequestDto request)
    {
        var outputs = request.Inputs != null
            ? new Dictionary<string, object?>(request.Inputs)
            : new Dictionary<string, object?>();
        return new AIInferenceResponseDto(outputs, 0.0, request.ModelId);
    }

    public AIModelsResponseDto ListModels()
    {
        return new AIModelsResponseDto(DefaultModels);
    }
}
