using System;
using System.Collections.Generic;

namespace DriftDetection.Data.Models;

public partial class DriftReport
{
    public int Id { get; set; }

    public int DatasetId { get; set; }

    public string DriftType { get; set; } = null!;

    public string Severity { get; set; } = null!;

    public string? Details { get; set; }

    public DateTime? DetectedAt { get; set; }

    public int? Score { get; set; }

    public virtual DatasetConfig Dataset { get; set; } = null!;
}
