using EngineApi.DTOs;

namespace EngineApi.Services;

public class OptimizationService : IOptimizationService
{
    public OptimizationResponseDto Optimize(OptimizationRequestDto request)
    {
        return new OptimizationResponseDto(
            TargetId: request.TargetId ?? "default",
            Value: 0.0,
            Feasible: true
        );
    }
}
