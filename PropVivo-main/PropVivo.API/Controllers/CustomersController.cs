using MediatR;
using Microsoft.AspNetCore.Mvc;
using PropVivo.Application.Dto.CustomerFeatures.GetCustomerByPhone;
using PropVivo.Application.Dto.CustomerFeatures.CreateCustomer;

namespace PropVivo.API.Controllers;

[Route("api/v1/[controller]")]
public class CustomersController : BaseController 
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("by-phone/{phoneNumber}")]
    public async Task<IActionResult> GetByPhoneNumber(string phoneNumber)
    {
        var response = await _mediator.Send(new GetCustomerByPhoneRequest { PhoneNumber = phoneNumber });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }
}