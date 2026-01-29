using System.Net;
using System.Net.Http.Json;
using EngineApi.Controllers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace EngineApi.Tests;

public class HealthControllerTests
{
    [Fact]
    public void Get_Returns_Ok_With_Healthy_Status()
    {
        var controller = new HealthController();
        var result = controller.Get();
        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.Value.Should().NotBeNull();
        ok.Value.Should().BeEquivalentTo(new { status = "healthy", service = "engine-api" });
    }
}
