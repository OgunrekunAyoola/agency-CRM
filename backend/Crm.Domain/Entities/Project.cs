namespace Crm.Domain.Entities;

public class Project : BaseEntity, ITenantedEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? ClientId { get; set; }
    public Client? Client { get; set; }
    public Guid? OfferId { get; set; }
    public Offer? Offer { get; set; }
    public Guid TenantId { get; set; }
    public ICollection<CrmTask> Tasks { get; set; } = new List<CrmTask>();
}
