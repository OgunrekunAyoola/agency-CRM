namespace Crm.Domain.Entities;

public class OutboxMessage : BaseEntity
{
    public string Type { get; set; } = string.Empty; // E.g., "SlackNotification", "Email"
    public string Content { get; set; } = string.Empty; // JSON payload
    public DateTime? ProcessedAt { get; set; }
    public string? Error { get; set; }
    public int RetryCount { get; set; }
}
