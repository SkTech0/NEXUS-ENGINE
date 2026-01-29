namespace EngineApi.Repositories;

public class EngineRepository : IEngineRepository
{
    private readonly Dictionary<string, object?> _state = new();

    public object? GetState()
    {
        return _state.Count > 0 ? _state : new { status = "ready" };
    }

    public object? Execute(string action, IReadOnlyDictionary<string, object?>? parameters)
    {
        _state["lastAction"] = action;
        _state["lastParameters"] = parameters;
        return new { executed = action, parameters };
    }
}
