using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using PropVivo.Application.Repositories;
using PropVivo.Domain.Entities.CallCenter;
using PropVivo.Infrastructure.Interfaces;
using System.Linq;


namespace PropVivo.Infrastructure.Repositories;

public class CustomerRepository : CosmosDbRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(ICosmosDbContainerFactory factory) : base(factory) { }

    // DB Container name
    public override string ContainerName => "CallCenter";

    public override string GenerateId(Customer entity) => entity.Id;
    public override PartitionKey ResolvePartitionKey(string entityId) => new PartitionKey(nameof(Customer));

    // method to lookup a customer by phone number
    public async Task<Customer?> GetByPhoneNumberAsync(string phoneNumber)
    {
        return await base.GetItemAsync(c => c.DocumentType == nameof(Customer) && c.PhoneNumber == phoneNumber);
    }
}