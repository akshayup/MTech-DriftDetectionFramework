using System;
using System.Collections.Generic;

namespace DriftDetection.Data.Models;

public partial class DatasetConfig
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string FileType { get; set; } = null!;

    public string StorageType { get; set; } = null!;

    public string ContainerName { get; set; } = null!;

    public string OwningTeam { get; set; } = null!;

    public string Frequency { get; set; } = null!;

    public string ExpectedSchema { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public bool IsActive { get; set; }

    public bool AutoLearnSchema { get; set; }

    public int CheckIntervalMinutes { get; set; }

    public string? CheckIntervalCron { get; set; }

    public string? DatasetDetails { get; set; }

    public string? FieldDelimiter { get; set; }

    public DateTime? LastCheckedAt { get; set; }

    public virtual ICollection<DriftReport> DriftReports { get; set; } = new List<DriftReport>();

    public virtual ICollection<FileHistory> FileHistories { get; set; } = new List<FileHistory>();
}
