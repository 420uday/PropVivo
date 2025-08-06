using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.TwiML;
using Twilio.TwiML.Voice;

namespace PropVivo.Backend.Services
{
    public class TwilioService
    {
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _phoneNumber;

        public TwilioService(IConfiguration configuration)
        {
            _accountSid = configuration["Twilio:AccountSid"];
            _authToken = configuration["Twilio:AuthToken"];
            _phoneNumber = configuration["Twilio:PhoneNumber"];
            TwilioClient.Init(_accountSid, _authToken);
        }

        public VoiceResponse GenerateIncomingCallResponse()
        {
            var response = new VoiceResponse();
            response.Say("Thank you for calling PropVivo support.");
            response.Dial(_phoneNumber);
            return response;
        }

        public async Task SendCallNotificationAsync(string to, string from)
        {
            await CallResource.CreateAsync(
                to: to,
                from: _phoneNumber,
                url: new System.Uri("https://yourdomain.com/api/call/answer")
            );
        }
    }
}