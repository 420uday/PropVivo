using PropVivo.Domain.Common;
using Microsoft.Azure.Cosmos;

namespace PropVivo.Domain.Entities.CallCenter;

public class Customer : BaseEntity
{


    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty; // To be looked up
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}