namespace EngineApi.Models;

public class EngineRequest
{
    public string? Action { get; set; }
    public IDictionary<string, object?>? Parameters { get; set; }
}
