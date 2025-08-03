using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PropVivo.API.Hubs;
using PropVivo.Application.Dto.CustomerFeatures.GetCustomerByPhone;
using Twilio.TwiML;
using Twilio.TwiML.Voice;

namespace PropVivo.API.Controllers;

[Route("api/webhooks")]
[ApiController]
public class WebhookController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IHubContext<CallHub> _hubContext;
    private readonly ILogger<WebhookController> _logger;

    public WebhookController(IMediator mediator, IHubContext<CallHub> hubContext, ILogger<WebhookController> logger)
    {
        _mediator = mediator;
        _hubContext = hubContext;
        _logger = logger;
    }

    [HttpPost("incoming-call")]
    [AllowAnonymous]
    public async Task<IActionResult> HandleIncomingCall([FromForm] IFormCollection form)
    {
        var fromNumber = form["From"].FirstOrDefault() ?? "";
        _logger.LogInformation("Incoming call from: {fromNumber}", fromNumber);

        // Look up customer and notify frontend
        try
        {
            var customerResponse = await _mediator.Send(new GetCustomerByPhoneRequest { PhoneNumber = fromNumber });
            if (customerResponse.Success)
            {
                await _hubContext.Clients.All.SendAsync("IncomingCall", customerResponse.Data);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Customer lookup failed for: {fromNumber}", fromNumber);
        }
        
        // Send TwiML response to Twilio
        var response = new VoiceResponse();
        var dial = new Dial();
        dial.Append(new Client("support_agent"));
        response.Append(dial);

        return Content(response.ToString(), "application/xml");
    }
}