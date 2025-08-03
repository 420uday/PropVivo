using MediatR;
using PropVivo.Application.Common.Base;

namespace PropVivo.Application.Dto.CustomerFeatures.CreateCustomer;

public class CreateCustomerRequest : IRequest<BaseResponse<CreateCustomerResponse>>
{
    public string? Name { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
}