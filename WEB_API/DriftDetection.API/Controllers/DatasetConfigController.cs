

using DriftDetection.API;
using DriftDetection.API.Helper;
using DriftDetection.API.Model.DriftDetectionAPI.Models;
using DriftDetection.API.Model.Request;
using DriftDetection.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DriftDetectionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetConfigController : ControllerBase
    {
        private readonly MyTestDbContext _context;

        public DatasetConfigController(MyTestDbContext context)
        {
            _context = context;
        }

        // GET: api/datasets/{id}
        [HttpGet("/api/datasets/{id}")]
        public async Task<IActionResult> GetDatasetById(int id)
        {
            try
            {
                var dataset = await _context.DatasetConfigs
                    .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

                if (dataset == null)
                {
                    return NotFound(new { message = "Dataset not found" });
                }

                return Ok(dataset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the dataset", error = ex.Message });
            }
        }

        // PUT: api/datasets/{id}
        [HttpPut("/api/datasets/{id}")]
        public async Task<IActionResult> UpdateDataset(int id, [FromBody] DatasetUpdateRequest request)
        {
            try
            {
                var dataset = await _context.DatasetConfigs
                    .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

                if (dataset == null)
                {
                    return NotFound(new { message = "Dataset not found" });
                }

                // Update fields
                dataset.Name = request.Name;
                dataset.DatasetDetails= request.Description;
                dataset.FilePath= request.FolderPath;
                dataset.FileType = request.FileType;
                dataset.FieldDelimiter= request.Delimiter;
                dataset.StorageType = request.StorageType;
                dataset.ContainerName = request.ContainerName;
                dataset.CheckIntervalMinutes = request.CheckIntervalMinutes;
                dataset.OwningTeam = request.OwningTeam;
                dataset.AutoLearnSchema= request.EnableSchemaLearning;
                dataset.ExpectedSchema = request.ManualSchema;
                dataset.IsActive = request.Status=="Active";
                dataset.ModifiedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Dataset updated successfully",
                    id = id,
                    updatedAt = dataset.ModifiedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the dataset", error = ex.Message });
            }
        }

        // Fixed C# code for your DatasetConfigs table structure
        [HttpGet("/api/datasets")]
        public async Task<IActionResult> GetDatasets(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 9,
            [FromQuery] string search = "",
            [FromQuery] string status = "",
            [FromQuery] string dataType = "",
            [FromQuery] string sortBy = "lastUpdated",
            [FromQuery] string sortOrder = "desc")
        {
            try
            {
                var query = _context.DatasetConfigs.Where(d => !d.IsDeleted) // Filter out soft-deleted datasets
            .AsQueryable();

                // Apply search filter
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(d => d.Name.Contains(search) ||
                                           d.FileType.Contains(search) ||
                                           d.OwningTeam.Contains(search));
                }

                // Apply status filter (map to IsActive)
                if (!string.IsNullOrEmpty(status) && status != "all")
                {
                    bool isActive = status.Equals("Active", StringComparison.OrdinalIgnoreCase);
                    query = query.Where(d => d.IsActive == isActive);
                }

                // Apply data type filter (map to FileType)
                if (!string.IsNullOrEmpty(dataType) && dataType != "all")
                {
                    query = query.Where(d => d.FileType.Equals(dataType, StringComparison.OrdinalIgnoreCase));
                }

                // Apply sorting
                query = sortBy.ToLower() switch
                {
                    "name" => sortOrder == "desc" ? query.OrderByDescending(d => d.Name) : query.OrderBy(d => d.Name),
                    "status" => sortOrder == "desc" ? query.OrderByDescending(d => d.IsActive) : query.OrderBy(d => d.IsActive),
                    "lastupdated" => sortOrder == "desc" ? query.OrderByDescending(d => d.ModifiedAt ?? d.CreatedAt) : query.OrderBy(d => d.ModifiedAt ?? d.CreatedAt),
                    _ => query.OrderByDescending(d => d.ModifiedAt ?? d.CreatedAt)
                };

                // Get total count for pagination
                var totalItems = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalItems / limit);

                // Apply pagination and select data
                var datasets = await query
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .Select(d => new
                    {
                        id = d.Id,
                        name = d.Name,
                        status = d.IsActive ? "Active" : "Inactive", // Map IsActive to status
                        lastUpdated = (d.ModifiedAt ?? d.CreatedAt).Value.ToString("yyyy-MM-dd"), // Fixed DateTime formatting
                        dataType = d.FileType, // Map FileType to dataType for frontend
                        owningTeam = d.OwningTeam,
                        folderPath = d.FilePath, // Map FilePath to folderPath
                        storageType = d.StorageType,
                        description = d.DatasetDetails ?? "", // Map DatasetDetails to description
                        checkInterval = d.CheckIntervalMinutes,
                        delimiter = d.FieldDelimiter ?? ",",
                        autoLearnSchema = d.AutoLearnSchema,
                        expectedSchema = d.ExpectedSchema ?? "",
                        frequency = d.Frequency ?? "",
                        //lastChecked = d.LastCheckedAt?.ToString("yyyy-MM-dd HH:mm:ss")
                    })
                    .ToListAsync();

                // Calculate statistics using IsActive instead of Status
                var totalCount = await _context.DatasetConfigs.CountAsync(d => !d.IsDeleted);
                var activeCount = await _context.DatasetConfigs.CountAsync(d => d.IsActive && (!d.IsDeleted));
                var inactiveCount = await _context.DatasetConfigs.CountAsync(d => !d.IsActive && (!d.IsDeleted));
                var monitoringTypesCount = await _context.DatasetConfigs
                    .Where(d => !d.IsDeleted)
                    .Select(d => d.FileType)
                    .Distinct()
                    .CountAsync();

                var stats = new
                {
                    total = totalCount,
                    active = activeCount,
                    inactive = inactiveCount,
                    monitoringTypes = monitoringTypesCount
                };

                return Ok(new
                {
                    datasets = datasets,
                    pagination = new
                    {
                        page = page,
                        limit = limit,
                        total = totalItems,
                        totalPages = totalPages
                    },
                    stats = stats
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error retrieving datasets",
                    error = ex.Message
                });
            }
        }


        [HttpPost("/api/createdatasets")]
        public async Task<ActionResult> CreateDataset([FromBody] CreateDatasetRequest request)
        {
            try
            {
                // 1. Validate the request
                if (string.IsNullOrEmpty(request.Name))
                {
                    return BadRequest(new { message = "Dataset name is required" });
                }

                if (string.IsNullOrEmpty(request.FolderPath))
                {
                    return BadRequest(new { message = "Folder path is required" });
                }

                if (string.IsNullOrEmpty(request.OwningTeam))
                {
                    return BadRequest(new { message = "Owning team is required" });
                }

                // 2. Parse manual schema if provided
                string expectedSchema = "";
                if (!request.EnableSchemaLearning && !string.IsNullOrEmpty(request.ManualSchema))
                {
                    var columns = request.ManualSchema
                        .Split(new char[] { ',', ';', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(col => col.Trim())
                        .Where(col => !string.IsNullOrEmpty(col));

                    expectedSchema = string.Join(",", columns);
                }

                // 3. Prepare minimal dataset details (since most config is now in ContainerName)
                var datasetDetails = new
                {
                    description = request.Description,
                    enableDataQualityChecks = request.EnableDataQualityChecks,
                    createdFromReact = true,
                    version = "1.0"
                };

                // 4. Create the dataset entity
                var dataset = new DatasetConfig
                {
                    Name = request.Name,
                    FilePath = request.FolderPath,
                    FileType = request.FileType?.ToUpper() ?? "CSV",
                    StorageType = request.StorageType ?? "Local",
                    ContainerName = request.ContainerName ?? "", // All storage config goes here
                    OwningTeam = request.OwningTeam, // From dropdown
                    Frequency = CronHelper.MapCheckIntervalToFrequency(request.CheckIntervalMinutes),
                    ExpectedSchema = expectedSchema,
                    IsDeleted = false,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = null,
                    IsActive = request.Status,
                    AutoLearnSchema = request.EnableSchemaLearning,
                    CheckIntervalMinutes = request.CheckIntervalMinutes,
                    CheckIntervalCron = CronHelper.GenerateCronFromMinutes(request.CheckIntervalMinutes),
                    DatasetDetails = JsonSerializer.Serialize(datasetDetails),
                    FieldDelimiter = request.Delimiter ?? ",",
                    LastCheckedAt = null
                };

                // 5. Save to database
                _context.DatasetConfigs.Add(dataset);
                await _context.SaveChangesAsync();

                // 6. Return success response
                var response = new
                {
                    id = dataset.Id,
                    name = dataset.Name,
                    status = "created",
                    message = "Dataset created successfully",
                    createdAt = dataset.CreatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to create dataset",
                    error = ex.Message
                });
            }

        }


        // DELETE: /api/deletedatasets/{id}
        [HttpDelete("/api/deletedataset/{id}")]
        public async Task<IActionResult> DeleteDataset(int id)
        {
            try
            {
                // Check if dataset exists and is not already deleted
                var dataset = await _context.DatasetConfigs
                    .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

                if (dataset == null)
                {
                    return NotFound(new { message = "Dataset not found or already deleted" });
                }

                // Soft delete - set IsDeleted to true
                dataset.IsDeleted = true;
                dataset.ModifiedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Dataset deleted successfully",
                    id = id,
                    deletedAt = dataset.ModifiedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the dataset", error = ex.Message });
            }
        }

    }
}

