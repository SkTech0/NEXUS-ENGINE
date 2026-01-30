using EngineApi.DTOs;
using EngineApi.Repositories;

namespace EngineApi.Services;

public class EngineService : IEngineService
{
    private readonly IEngineRepository _repository;

    public EngineService(IEngineRepository repository)
    {
        _repository = repository;
    }

    public EngineResponseDto GetStatus()
    {
        var state = _repository.GetState();
        return new EngineResponseDto("ok", state, null);
    }

    public EngineResponseDto Execute(EngineRequestDto request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));
        var action = string.IsNullOrWhiteSpace(request.Action) ? "default" : request.Action;
        var result = _repository.Execute(action, request.Parameters);
        return new EngineResponseDto("ok", result, null);
    }
}
