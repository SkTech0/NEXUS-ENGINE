using EngineApi.DTOs;

namespace EngineApi.Services;

public interface IIntelligenceService
{
    IntelligenceResponseDto Evaluate(IntelligenceRequestDto request);
}
