using EngineApi.Controllers;
using EngineApi.DTOs;
using EngineApi.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EngineApi.Tests;

public class OptimizationControllerTests
{
    private readonly Mock<IOptimizationService> _optimizationService = new();

    [Fact]
    public void Optimize_Returns_Ok_With_Service_Result()
    {
        var request = new OptimizationRequestDto("t1", "minimize", null);
        var dto = new OptimizationResponseDto("t1", 42.0, true);
        _optimizationService.Setup(s => s.Optimize(request)).Returns(dto);

        var controller = new OptimizationController(_optimizationService.Object);
        var raw = controller.Optimize(request);
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<OptimizationResponseDto>(ok.Value);
        value.TargetId.Should().Be(dto.TargetId);
        value.Value.Should().Be(dto.Value);
        value.Feasible.Should().Be(dto.Feasible);
    }

    [Fact]
    public void Health_Returns_Ok()
    {
        var controller = new OptimizationController(_optimizationService.Object);
        var result = controller.Health();
        result.Should().BeOfType<OkObjectResult>();
    }
}
