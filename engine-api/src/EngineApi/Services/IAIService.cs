using EngineApi.DTOs;

namespace EngineApi.Services;

public interface IAIService
{
    AIInferenceResponseDto Infer(AIInferenceRequestDto request);
    AIModelsResponseDto ListModels();
}
