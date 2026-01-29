namespace EngineApi.Repositories;

public interface IEngineRepository
{
    object? GetState();
    object? Execute(string action, IReadOnlyDictionary<string, object?>? parameters);
}
