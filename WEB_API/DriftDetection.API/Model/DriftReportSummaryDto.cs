namespace DriftDetection.API.Model
{

    public class DriftReportSummaryDto
    {
        public int TotalReports { get; set; }
        public int CriticalCount { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }
        public DateTime? LastDetected { get; set; }
        public List<DriftTypeSummary> DriftTypes { get; set; } = new List<DriftTypeSummary>();
    }

    
}
