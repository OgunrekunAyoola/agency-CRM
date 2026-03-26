using Moq;
using Crm.Application.Services;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Crm.Application.DTOs.Projects;
using Xunit;

namespace Crm.UnitTests.Services;

public class ProjectServiceTests
{
    private readonly Mock<IGenericRepository<Project>> _repositoryMock;
    private readonly Mock<ICurrentUserContext> _currentUserContextMock;
    private readonly ProjectService _service;

    public ProjectServiceTests()
    {
        _repositoryMock = new Mock<IGenericRepository<Project>>();
        _currentUserContextMock = new Mock<ICurrentUserContext>();
        _service = new ProjectService(_repositoryMock.Object, _currentUserContextMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateProjectAndSave()
    {
        // Arrange
        var request = new CreateProjectRequest
        {
            Name = "Test Project",
            Description = "Test Description",
            ClientId = Guid.NewGuid()
        };

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(request.Name, result.Name);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Project>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
