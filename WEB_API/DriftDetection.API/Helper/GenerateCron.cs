namespace DriftDetection.API.Helper
{
    public static class CronHelper
    {
        //public static string GenerateCron(int minutes)
        //{
        //    return minutes switch
        //    {
        //        5 => "*/5 * * * *",
        //        10 => "*/10 * * * *",
        //        30 => "*/30 * * * *",
        //        60 => "0 * * * *",
        //        240 => "0 */4 * * *",
        //        1440 => "0 0 * * *",
        //        _ => $"*/{minutes} * * * *"
        //    };
        //}

        public static string MapCheckIntervalToFrequency(int minutes)
        {
            return minutes switch
            {
                5 => "Every 5 minutes",
                10 => "Every 10 minutes",
                30 => "Every 30 minutes",
                60 => "Hourly",
                240 => "Every 4 hours",
                1440 => "Daily",
                _ => "Custom"
            };
        }

        // Helper method to generate cron expression
        public static string GenerateCronFromMinutes(int minutes)
        {
            return minutes switch
            {
                5 => "*/5 * * * *",      // Every 5 minutes
                10 => "*/10 * * * *",    // Every 10 minutes
                30 => "*/30 * * * *",    // Every 30 minutes  
                60 => "0 * * * *",       // Every hour
                240 => "0 */4 * * *",    // Every 4 hours
                1440 => "0 0 * * *",     // Daily at midnight
                _ => $"*/{minutes} * * * *" // Custom interval
            };
        }

    }
}
