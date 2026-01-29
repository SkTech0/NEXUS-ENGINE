using EngineApi.Controllers;
using EngineApi.DTOs;
using EngineApi.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EngineApi.Tests;

public class TrustControllerTests
{
    private readonly Mock<ITrustService> _trustService = new();

    [Fact]
    public void Verify_Returns_Ok_With_Service_Result()
    {
        var request = new TrustVerifyRequestDto("token", new { sub = "user1" });
        var dto = new TrustVerifyResponseDto(true, "valid");
        _trustService.Setup(s => s.Verify(request)).Returns(dto);

        var controller = new TrustController(_trustService.Object);
        var raw = controller.Verify(request);
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<TrustVerifyResponseDto>(ok.Value);
        value.Valid.Should().Be(dto.Valid);
        value.Message.Should().Be(dto.Message);
    }

    [Fact]
    public void GetScore_Returns_Ok_With_Service_Result()
    {
        var dto = new TrustScoreResponseDto("e1", 0.85, "reputation");
        _trustService.Setup(s => s.GetScore("e1")).Returns(dto);

        var controller = new TrustController(_trustService.Object);
        var raw = controller.GetScore("e1");
        var ok = Assert.IsType<OkObjectResult>(raw.Result);
        var value = Assert.IsType<TrustScoreResponseDto>(ok.Value);
        value.EntityId.Should().Be(dto.EntityId);
        value.Score.Should().Be(dto.Score);
    }

    [Fact]
    public void Health_Returns_Ok()
    {
        var controller = new TrustController(_trustService.Object);
        var result = controller.Health();
        result.Should().BeOfType<OkObjectResult>();
    }
}
