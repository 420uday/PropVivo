using PropVivo.Application.Repositories;
using PropVivo.Domain.Entities.CallCenter;
using PropVivo.Infrastructure.Interfaces;
using Microsoft.Azure.Cosmos;

namespace PropVivo.Infrastructure.Repositories;

public class CallLogRepository : CosmosDbRepository<CallLog>, ICallLogRepository
{
    public CallLogRepository(ICosmosDbContainerFactory factory) : base(factory) { }
    public override string ContainerName => "CallCenter";
    public override string GenerateId(CallLog entity) => entity.Id;
    public override PartitionKey ResolvePartitionKey(string entityId) => new PartitionKey(entityId);
}
