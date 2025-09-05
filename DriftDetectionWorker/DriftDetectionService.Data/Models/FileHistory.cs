using System;
using System.Collections.Generic;

namespace DriftDetectionService.Data.Models;

public partial class FileHistory
{
    public int Id { get; set; }

    public int DatasetId { get; set; }

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public DateTime? ProcessedAt { get; set; }

    public virtual DatasetConfig Dataset { get; set; } = null!;
}
