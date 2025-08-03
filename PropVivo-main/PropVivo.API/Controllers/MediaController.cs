using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using PropVivo.Application.Dto.MediaFeature.BulkUploadMedia;
using PropVivo.Application.Dto.MediaFeature.DownloadMedia;
using PropVivo.Application.Dto.MediaFeature.UploadMedia;

namespace PropVivo.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class MediaController : BaseController
    {
        private readonly IMediator _mediator;

        public MediaController(IMediator mediator)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        }

        [HttpPost("BulkUpload")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BulkUploadMediaResponse>> BulkUploadMediaAsync([FromForm] BulkUploadMediaRequest bulkUploadMediaRequest, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(bulkUploadMediaRequest, cancellationToken);
            return Ok(response);
        }

        [HttpGet("Download")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Download([FromQuery] DownloadMediaRequest downloadMediaRequest, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(downloadMediaRequest, cancellationToken);
            
            // Add null checks for robustness
            if (response?.Data?.Content == null || response.Data.ContentType == null)
            {
                return NotFound($"File specified could not be downloaded or was empty.");
            }
            
            return File(response.Data.Content, response.Data.ContentType, response.Data.FileName);
        }

        [HttpPost("Upload")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UploadMediaResponse>> UploadMediaAsync([FromForm] UploadMediaRequest uploadMediaRequest, CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(uploadMediaRequest, cancellationToken);
            return Ok(response);
        }
    }
}