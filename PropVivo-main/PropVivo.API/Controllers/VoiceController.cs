using Microsoft.AspNetCore.Mvc;
using Twilio.Jwt.AccessToken;

namespace PropVivo.API.Controllers;

[Route("api/v1/[controller]")]
public class VoiceController : BaseController
{
    private readonly IConfiguration _config;

    public VoiceController(IConfiguration config)
    {
        _config = config;
    }

    [HttpGet("token")]
    public IActionResult GetToken()
    {
        var accountSid = _config["Twilio:AccountSid"];
        var apiKey = _config["Twilio:ApiKey"];
        var apiSecret = _config["Twilio:ApiSecret"];
        var appSid = _config["Twilio:AppSid"];

        var grant = new VoiceGrant
        {
            OutgoingApplicationSid = appSid,
            IncomingAllow = true
        };

        var token = new Token(accountSid, apiKey, apiSecret, "support_agent", grants: new HashSet<IGrant> { grant });

        return Ok(new { token = token.ToJwt() });
    }
}