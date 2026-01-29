using EngineApi.DTOs;

namespace EngineApi.Services;

public interface IOptimizationService
{
    OptimizationResponseDto Optimize(OptimizationRequestDto request);
}
