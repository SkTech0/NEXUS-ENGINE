using EngineApi.DTOs;

namespace EngineApi.Services;

public class TrustService : ITrustService
{
    public TrustVerifyResponseDto Verify(TrustVerifyRequestDto request)
    {
        return new TrustVerifyResponseDto(Valid: false, Message: "Not implemented");
    }

    public TrustScoreResponseDto GetScore(string entityId)
    {
        return new TrustScoreResponseDto(EntityId: entityId, Score: 0.0, Source: null);
    }
}
