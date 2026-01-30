using EngineApi.DTOs;

namespace EngineApi.Services;

public class TrustService : ITrustService
{
    public TrustVerifyResponseDto Verify(TrustVerifyRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        return new TrustVerifyResponseDto(Valid: false, Message: "Not implemented");
    }

    public TrustScoreResponseDto GetScore(string entityId)
    {
        if (string.IsNullOrWhiteSpace(entityId))
            throw new ArgumentException("entityId is required", nameof(entityId));
        return new TrustScoreResponseDto(EntityId: entityId, Score: 0.0, Source: null);
    }
}
