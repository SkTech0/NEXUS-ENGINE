using EngineApi.DTOs;

namespace EngineApi.Services;

public interface ITrustService
{
    TrustVerifyResponseDto Verify(TrustVerifyRequestDto request);
    TrustScoreResponseDto GetScore(string entityId);
}
