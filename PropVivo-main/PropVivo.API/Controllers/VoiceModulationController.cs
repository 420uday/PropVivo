using Microsoft.AspNetCore.Mvc;

namespace PropVivo.API.Controllers;

[Route("api/v1/[controller]")]
public class VoiceModulationController : BaseController // Secure this endpoint
{
    private readonly IHttpClientFactory _httpClientFactory;

    public VoiceModulationController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("modulate-agent-voice")]
    public async Task<IActionResult> ModulateAgentVoice(IFormFile agentAudioFile)
    {
        if (agentAudioFile == null || agentAudioFile.Length == 0)
        {
            return BadRequest("Agent audio file is required.");
        }

        // 1. Prepare and send the agent's audio to the Python service
        var pythonServiceClient = _httpClientFactory.CreateClient();
        using var content = new MultipartFormDataContent();
        using var fileStream = agentAudioFile.OpenReadStream();
        content.Add(new StreamContent(fileStream), "file", agentAudioFile.FileName);

        var pythonServiceUrl = "http://localhost:8000/process-audio/";
        var response = await pythonServiceClient.PostAsync(pythonServiceUrl, content);

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode(500, "Error from Python voice modulation service.");
        }

        // 2. Get the converted audio back
        var convertedAudioBytes = await response.Content.ReadAsByteArrayAsync();

        // 3. Return the modulated audio file directly to the frontend
        return File(convertedAudioBytes, "audio/wav", "modulated_output.wav");
    }
}