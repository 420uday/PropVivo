using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PropVivo.Backend.Models;
using PropVivo.Backend.Services;
using Twilio.AspNet.Core;
using Twilio.TwiML;

namespace PropVivo.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CallController : TwilioController
    {
        private readonly ApplicationDbContext _context;
        private readonly TwilioService _twilioService;
        private readonly AccentService _accentService;

        public CallController(
            ApplicationDbContext context,
            TwilioService twilioService,
            AccentService accentService)
        {
            _context = context;
            _twilioService = twilioService;
            _accentService = accentService;
        }

        [HttpPost("incoming")]
        public async Task<IActionResult> HandleIncomingCall()
        {
            var callerNumber = Request.Form["From"];
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.PhoneNumber == callerNumber);

            // Log the call
            var callLog = new CallLog
            {
                CallerNumber = callerNumber,
                CallStartTime = DateTime.UtcNow,
                Status = "in-progress"
            };
            _context.CallLogs.Add(callLog);
            await _context.SaveChangesAsync();

            return Content(_twilioService.GenerateIncomingCallResponse().ToString(), "application/xml");
        }

        [HttpPost("answer")]
        public IActionResult AnswerCall()
        {
            var response = new VoiceResponse();
            response.Say("Connecting you to a support agent.");
            response.Dial(_twilioService.PhoneNumber);
            return Content(response.ToString(), "application/xml");
        }

        [HttpGet("customer/{phoneNumber}")]
        public async Task<IActionResult> GetCustomer(string phoneNumber)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.PhoneNumber == phoneNumber);

            if (customer == null)
                return NotFound();

            return Ok(customer);
        }
    }
}