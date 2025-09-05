using DriftDetectionService.Data.Models;
using DriftDetectionServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NCrontab;
using System;
using System.Text;

namespace DriftDetectionService
{

    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _provider;
        private readonly DriftWorkerOptions _options;


        public Worker(ILogger<Worker> logger, IServiceProvider provider, IConfiguration configuration)
        {
            _logger = logger;
            _provider = provider;
            _logger = logger;
            _options = configuration.GetSection("DriftWorker").Get<DriftWorkerOptions>() ?? new DriftWorkerOptions();

        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
          
            _logger.LogInformation("DriftDetectionService starting. Polling interval: {0}s", _options.PollingIntervalSeconds);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunOnce(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unexpected error in DriftDetectionService");
                }

                await Task.Delay(TimeSpan.FromSeconds(_options.PollingIntervalSeconds), stoppingToken);
            }

            _logger.LogInformation("DriftDetectionService stopping.");
        }

        private async Task RunOnce(CancellationToken ct)
        {
            using var scope = _provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyTestDbContext>();
            var now = DateTime.UtcNow;

            var datasets = await db.DatasetConfigs
                .Where(d => !d.IsDeleted && d.CheckIntervalCron != null)
                .ToListAsync(ct);

            foreach (var ds in datasets)
            {
                try
                {
                    if (ShouldRunNow(ds, now))
                    {
                        await ProcessDataset(ds, db, now);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error checking dataset {name}", ds.Name);
                }
            }
        }

        private bool ShouldRunNow(DatasetConfig ds, DateTime now)
        {
            if (string.IsNullOrEmpty(ds.CheckIntervalCron))
                return false;

            try
            {
                var schedule = CrontabSchedule.Parse(ds.CheckIntervalCron);
                var last = ds.LastCheckedAt ?? now.AddMinutes(-10000); // way back
                var next = schedule.GetNextOccurrence(last);

                return now >= next && (ds.LastCheckedAt == null || now.Subtract(ds.LastCheckedAt.Value).TotalSeconds > 10);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Invalid cron expression for dataset {name}", ds.Name);
                return false;
            }
        }

        private async Task ProcessDataset(DatasetConfig ds, MyTestDbContext db, DateTime now)
        {
            if (!Directory.Exists(ds.FilePath))
            {
                _logger.LogWarning("Folder not found: {path} for dataset {name}", ds.FilePath, ds.Name);
                return;
            }

            var file = Directory.GetFiles(ds.FilePath)
                .Where(f => f.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(f => File.GetCreationTimeUtc(f))
                .FirstOrDefault();

            if (file == null)
            {
                _logger.LogInformation(" No new file found for {name}", ds.Name);
                ds.LastCheckedAt = now;
                db.DatasetConfigs.Update(ds);
                await db.SaveChangesAsync();
                return;
            }

            // Read header
            string headerLine = File.ReadLines(file).FirstOrDefault() ?? "";
            if (string.IsNullOrWhiteSpace(headerLine))
            {
                await RecordDrift(db, ds, "Schema", 100, "High", $"Empty header in {Path.GetFileName(file)}");
                return;
            }

            var delimiter = SchemaUtils.DetectDelimiter(headerLine);
            var actualCols = SchemaUtils.ParseHeader(headerLine, delimiter).ToList();
            var expectedCols = ds.ExpectedSchema.Split(',').Select(s => s.Trim().ToLowerInvariant()).ToList();

            var diff = SchemaUtils.CompareSchemas(expectedCols, actualCols);

            if (diff.HasDrift)
            {
                int score = ComputeScore(diff);
                var severity = ComputeSeverity(score);

                var details = new StringBuilder();
                if (diff.Added.Any()) details.AppendLine($"Added: {string.Join(",", diff.Added)}");
                if (diff.Removed.Any()) details.AppendLine($"Removed: {string.Join(",", diff.Removed)}");
                if (diff.Renamed.Any()) details.AppendLine($"Renamed: {string.Join(" | ", diff.Renamed)}");

                await RecordDrift(db, ds, "Schema", score, severity, details.ToString());
            }
            else
            {
                _logger.LogInformation(" No drift detected for {name}", ds.Name);
            }

            ds.LastCheckedAt = now;
            db.DatasetConfigs.Update(ds);
            await db.SaveChangesAsync();
        }

        private int ComputeScore(SchemaDiff diff)
        {
            // Customize scoring logic
            return diff.Added.Count * 10 + diff.Removed.Count * 20 + diff.Renamed.Count * 15;
        }

        private string ComputeSeverity(int score)
        {
            if (score >= 50) return "High";
            if (score >= 20) return "Medium";
            return "Low";
        }

        private async Task RecordDrift(MyTestDbContext db, DatasetConfig ds, string driftType, int score, string severity, string details)
        {
            db.DriftReports.Add(new DriftReport
            {
                DatasetId = ds.Id,
                DriftType = driftType,
                Score = score,
                Severity = severity,
                Details = details,
                DetectedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync();
            _logger.LogWarning(" Drift detected for {name} | Score={score} | {sev} | {details}", ds.Name, score, severity, details);
        }
    }
}