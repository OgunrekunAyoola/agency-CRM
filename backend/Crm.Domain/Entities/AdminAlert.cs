namespace Crm.Domain.Entities;

public enum AlertSeverity
{
    Info,
    Warning,
    Critical
}

public class AdminAlert : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public AlertSeverity Severity { get; set; }
    public bool IsResolved { get; set; }
    public string? ResolutionNotes { get; set; }
    public string? Source { get; set; } // E.g., "GoogleAdsService", "OutboxProcessor"
}
