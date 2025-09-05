using DriftDetectionService;
using DriftDetectionService.Data.Models;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();


builder.Services.AddDbContext<MyTestDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var host = builder.Build();
host.Run();
