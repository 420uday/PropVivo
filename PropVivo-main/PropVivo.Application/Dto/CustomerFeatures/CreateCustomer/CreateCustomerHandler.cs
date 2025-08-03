using MediatR;
using PropVivo.Application.Common.Base;
using PropVivo.Application.Repositories;
using PropVivo.Domain.Entities.CallCenter;

namespace PropVivo.Application.Dto.CustomerFeatures.CreateCustomer;

public class CreateCustomerHandler : IRequestHandler<CreateCustomerRequest, BaseResponse<CreateCustomerResponse>>
{
    private readonly ICustomerRepository _customerRepository;

    public CreateCustomerHandler(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<BaseResponse<CreateCustomerResponse>> Handle(CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = new Customer
        {
            // Use ?? to provide a default value if the request's property is null
            Name = request.Name ?? string.Empty,
            PhoneNumber = request.PhoneNumber ?? string.Empty,
            Email = request.Email ?? string.Empty,
            Address = request.Address ?? string.Empty,
            Notes = request.Notes ?? string.Empty
        };

        // Setting the parition key
        customer.SetCustomDocumentType(nameof(Customer)); 

        // Add the customer to the repository
        var createdCustomer = await _customerRepository.AddItemAsync(customer, customer.DocumentType);

        return new BaseResponse<CreateCustomerResponse>
        {
            Data = new CreateCustomerResponse { CustomerId = createdCustomer.Id },
            Success = true,
            Message = "Customer created successfully."
        };
    }
}