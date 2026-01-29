namespace EngineApi.Models;

public class EngineResponse
{
    public string Status { get; set; } = "ok";
    public object? Result { get; set; }
    public string? Message { get; set; }
}
