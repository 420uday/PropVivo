using MediatR;
using PropVivo.Application.Common.Base;
using PropVivo.Application.Common.Exceptions;
using PropVivo.Application.Repositories;
using PropVivo.Domain.Entities.CallCenter;

namespace PropVivo.Application.Dto.CustomerFeatures.GetCustomerByPhone;

public class GetCustomerByPhoneHandler : IRequestHandler<GetCustomerByPhoneRequest, BaseResponse<Customer>>
{
    private readonly ICustomerRepository _customerRepository;

    public GetCustomerByPhoneHandler(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<BaseResponse<Customer>> Handle(GetCustomerByPhoneRequest request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByPhoneNumberAsync(request.PhoneNumber);

        if (customer == null)
        {
            throw new NotFoundException($"Customer with phone number {request.PhoneNumber} not found.");
        }

        return new BaseResponse<Customer>
        {
             Data = customer,
             Success = true,
             Message = "Customer found."
        };
    }
}