using EngineApi.DTOs;

namespace EngineApi.Services;

public class IntelligenceService : IIntelligenceService
{
    public IntelligenceResponseDto Evaluate(IntelligenceRequestDto request)
    {
        return new IntelligenceResponseDto(
            Outcome: "evaluated",
            Confidence: 0.0,
            Payload: request.Inputs
        );
    }
}
