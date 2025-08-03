using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using ElevenLabs;
using ElevenLabs.Voices;
using System.IO;

namespace PropVivo.API.Controllers
{
    [Route("api/v1/[controller]")]
    public class ModulationController : BaseController
    {
        private readonly IConfiguration _config;
        private readonly ILogger<ModulationController> _logger;

        public ModulationController(IConfiguration config, ILogger<ModulationController> logger)
        {
            _config = config;
            _logger = logger;
        }

        [HttpPost("say")]
        public async Task<IActionResult> ConvertTextToSpeech([FromBody] string text)
        {
            if (string.IsNullOrEmpty(text))
                return BadRequest("Text is required.");

            var apiKey = _config["ElevenLabs:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, "Voice service not configured.");

            try
            {
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("xi-api-key", apiKey);
                
                var voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice
                var request = new
                {
                    text = text,
                    model_id = "eleven_monolingual_v1",
                    voice_settings = new { stability = 0.5, similarity_boost = 0.5 }
                };

                var json = System.Text.Json.JsonSerializer.Serialize(request);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"https://api.elevenlabs.io/v1/text-to-speech/{voiceId}", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var audioBytes = await response.Content.ReadAsByteArrayAsync();
                    return File(new MemoryStream(audioBytes), "audio/mpeg");
                }
                
                return StatusCode(500, "Failed to generate speech.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Speech generation failed");
                return StatusCode(500, "Speech generation failed.");
            }
        }
    }
} 