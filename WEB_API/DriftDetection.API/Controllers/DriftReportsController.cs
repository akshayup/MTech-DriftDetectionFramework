using DriftDetection.API;
using DriftDetection.API.Model;
using DriftDetection.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace DriftDetectionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriftReportsController : ControllerBase
    {
        private readonly MyTestDbContext _context;

        public DriftReportsController(MyTestDbContext context)
        {
            _context = context;
        }
        // GET: api/driftreports
        [HttpGet]
        public async Task<ActionResult> GetDriftReports(
            [FromQuery] int? datasetId = null,
            [FromQuery] string? severity = null,
            [FromQuery] string? driftType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20)
        {
            try
            {
                var query = _context.DriftReports
                    .Include(dr => dr.Dataset)
                    .AsQueryable();

                // Apply filters
                if (datasetId.HasValue)
                    query = query.Where(dr => dr.DatasetId == datasetId.Value);

                if (!string.IsNullOrEmpty(severity))
                    query = query.Where(dr => dr.Severity.ToLower() == severity.ToLower());

                if (!string.IsNullOrEmpty(driftType))
                    query = query.Where(dr => dr.DriftType.ToLower().Contains(driftType.ToLower()));

                if (fromDate.HasValue)
                    query = query.Where(dr => dr.DetectedAt >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(dr => dr.DetectedAt <= toDate.Value);

                // Order by most recent first
                query = query.OrderByDescending(dr => dr.DetectedAt);

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var reports = await query
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .Select(dr => new
                    {
                        Id = dr.Id,
                        DatasetId = dr.DatasetId,
                        DatasetName = dr.Dataset != null ? dr.Dataset.Name : "Unknown",
                        DriftType = dr.DriftType,
                        Severity = dr.Severity,
                        Details = dr.Details,
                        DetectedAt = dr.DetectedAt,
                        Score = dr.Score
                    })
                    .ToListAsync();

                var response = new
                {
                    Data = reports,
                    TotalCount = totalCount,
                    Page = page,
                    Limit = limit,
                    TotalPages = (int)Math.Ceiling((double)totalCount / limit)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching drift reports", error = ex.Message });
            }
        }

    }
}
