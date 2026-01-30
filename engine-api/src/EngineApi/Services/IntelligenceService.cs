using EngineApi.DTOs;

namespace EngineApi.Services;

public class IntelligenceService : IIntelligenceService
{
    public IntelligenceResponseDto Evaluate(IntelligenceRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        return new IntelligenceResponseDto(
            Outcome: "evaluated",
            Confidence: 0.0,
            Payload: request.Inputs
        );
    }
}
