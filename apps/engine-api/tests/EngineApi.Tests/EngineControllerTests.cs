using EngineApi.Controllers;
using EngineApi.DTOs;
using EngineApi.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EngineApi.Tests;

public class EngineControllerTests
{
    private readonly Mock<IEngineService> _engineService = new();

    [Fact]
    public void GetStatus_Returns_Ok_With_Service_Result()
    {
        var dto = new EngineResponseDto("ok", new { engines = Array.Empty<object>() }, null);
        _engineService.Setup(s => s.GetStatus()).Returns(dto);

        var controller = new EngineController(_engineService.Object);
        var raw = controller.GetStatus();
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<EngineResponseDto>(ok.Value);
        value.Status.Should().Be(dto.Status);
    }

    [Fact]
    public void Execute_Returns_Ok_With_Service_Result()
    {
        var request = new EngineRequestDto("push", new Dictionary<string, object?> { ["source"] = "test" });
        var dto = new EngineResponseDto("ok", new { executed = "push" }, null);
        _engineService.Setup(s => s.Execute(request)).Returns(dto);

        var controller = new EngineController(_engineService.Object);
        var raw = controller.Execute(request);
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<EngineResponseDto>(ok.Value);
        value.Status.Should().Be(dto.Status);
    }
}
