using EngineApi.DTOs;

namespace EngineApi.Services;

public interface IEngineService
{
    EngineResponseDto GetStatus();
    EngineResponseDto Execute(EngineRequestDto request);
}
