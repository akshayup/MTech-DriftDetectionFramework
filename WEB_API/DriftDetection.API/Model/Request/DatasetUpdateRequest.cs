namespace DriftDetection.API.Model.Request
{
    public class DatasetUpdateRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }

        // File Configuration
        public string FolderPath { get; set; }
        public string FileType { get; set; }
        public string Delimiter { get; set; }

        // Storage Configuration  
        public string StorageType { get; set; }
        public string ContainerName { get; set; } // Will contain JSON for Azure, simple string for local

        // Monitoring Configuration
        public int CheckIntervalMinutes { get; set; }
        public string OwningTeam { get; set; } // Now from dropdown

        // Schema Configuration
        public bool EnableSchemaLearning { get; set; }
        public string ManualSchema { get; set; }

        // Status
        public string Status { get; set; }

        // Additional Configuration
        public bool EnableDataQualityChecks { get; set; }
    }
}
