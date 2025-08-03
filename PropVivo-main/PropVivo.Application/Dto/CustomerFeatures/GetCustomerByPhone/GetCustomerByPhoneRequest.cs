using MediatR;
using PropVivo.Application.Common.Base;
using PropVivo.Domain.Entities.CallCenter;

namespace PropVivo.Application.Dto.CustomerFeatures.GetCustomerByPhone;

public class GetCustomerByPhoneRequest : IRequest<BaseResponse<Customer>>
{
    public string PhoneNumber { get; set; } = string.Empty;
}