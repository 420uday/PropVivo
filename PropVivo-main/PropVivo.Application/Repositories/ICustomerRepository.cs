using PropVivo.Domain.Entities.CallCenter;

namespace PropVivo.Application.Repositories;

public interface ICustomerRepository : ICosmosRepository<Customer>
{
    Task<Customer?> GetByPhoneNumberAsync(string phoneNumber);
}