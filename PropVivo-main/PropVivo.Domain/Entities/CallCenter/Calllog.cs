using PropVivo.Domain.Common;
using Microsoft.Azure.Cosmos;

namespace PropVivo.Domain.Entities.CallCenter;

public class CallLog : BaseEntity
{

    public string CustomerId { get; set; } = string.Empty;
    public string CustomerPhoneNumber { get; set; } = string.Empty;
    public DateTime CallStarted { get; set; }
    public DateTime? CallEnded { get; set; }
    public string Status { get; set; } = string.Empty; //  "Ringing", "Answered", "Ended"
}