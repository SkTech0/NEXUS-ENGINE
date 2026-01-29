using EngineApi.Controllers;
using EngineApi.DTOs;
using EngineApi.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EngineApi.Tests;

public class AIControllerTests
{
    private readonly Mock<IAIService> _aiService = new();

    [Fact]
    public void Infer_Returns_Ok_With_Service_Result()
    {
        var request = new AIInferenceRequestDto("default", new Dictionary<string, object?> { ["x"] = 1 });
        var dto = new AIInferenceResponseDto(
            new Dictionary<string, object?> { ["y"] = 2 },
            1.5,
            "default");
        _aiService.Setup(s => s.Infer(request)).Returns(dto);

        var controller = new AIController(_aiService.Object);
        var raw = controller.Infer(request);
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<AIInferenceResponseDto>(ok.Value);
        value.ModelId.Should().Be(dto.ModelId);
        value.LatencyMs.Should().Be(dto.LatencyMs);
        value.Outputs.Should().ContainKey("y");
    }

    [Fact]
    public void ListModels_Returns_Ok_With_Model_Ids()
    {
        var dto = new AIModelsResponseDto(new List<string> { "default" });
        _aiService.Setup(s => s.ListModels()).Returns(dto);

        var controller = new AIController(_aiService.Object);
        var raw = controller.ListModels();
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<AIModelsResponseDto>(ok.Value);
        value.ModelIds.Should().Contain("default");
    }

    [Fact]
    public void Health_Returns_Ok()
    {
        var controller = new AIController(_aiService.Object);
        var result = controller.Health();
        result.Should().BeOfType<OkObjectResult>();
    }
}
