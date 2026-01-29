using EngineApi.Controllers;
using EngineApi.DTOs;
using EngineApi.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EngineApi.Tests;

public class IntelligenceControllerTests
{
    private readonly Mock<IIntelligenceService> _intelligenceService = new();

    [Fact]
    public void Evaluate_Returns_Ok_With_Service_Result()
    {
        var request = new IntelligenceRequestDto("test", new Dictionary<string, object?> { ["key"] = "value" });
        var dto = new IntelligenceResponseDto("evaluated", 0.9, request.Inputs);
        _intelligenceService.Setup(s => s.Evaluate(request)).Returns(dto);

        var controller = new IntelligenceController(_intelligenceService.Object);
        var raw = controller.Evaluate(request);
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<IntelligenceResponseDto>(ok.Value);
        value.Outcome.Should().Be(dto.Outcome);
        value.Confidence.Should().Be(dto.Confidence);
    }

    [Fact]
    public void Health_Returns_Ok()
    {
        var controller = new IntelligenceController(_intelligenceService.Object);
        var result = controller.Health();
        result.Should().BeOfType<OkObjectResult>();
    }
}
