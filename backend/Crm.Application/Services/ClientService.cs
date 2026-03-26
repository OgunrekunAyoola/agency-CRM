using Crm.Application.DTOs.Clients;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class ClientService
{
    private readonly IGenericRepository<Client> _repository;
    private readonly ICurrentUserContext _currentUserContext;

    public ClientService(IGenericRepository<Client> repository, ICurrentUserContext currentUserContext)
    {
        _repository = repository;
        _currentUserContext = currentUserContext;
    }

    public async Task<IEnumerable<ClientResponse>> GetAllAsync()
    {
        var clients = await _repository.GetAllAsync();
        return clients.Select(c => new ClientResponse
        {
            Id = c.Id,
            Name = c.Name,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<ClientResponse> CreateAsync(CreateClientRequest request)
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            TenantId = _currentUserContext.TenantId ?? Guid.Empty
        };

        await _repository.AddAsync(client);
        await _repository.SaveChangesAsync();

        return new ClientResponse
        {
            Id = client.Id,
            Name = client.Name,
            CreatedAt = client.CreatedAt
        };
    }
}
