using EngineApi.DTOs;

namespace EngineApi.Services;

public class OptimizationService : IOptimizationService
{
    public OptimizationResponseDto Optimize(OptimizationRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        var targetId = string.IsNullOrWhiteSpace(request.TargetId) ? "default" : request.TargetId;
        return new OptimizationResponseDto(
            TargetId: targetId,
            Value: 0.0,
            Feasible: true
        );
    }
}
