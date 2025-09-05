using System.Text;
using System.Text.Json;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine(" File Simulator Started...");

        var config = LoadConfig();
        var tasks = config.Datasets.Select(ds => SimulateDataset(ds, config.DriftProbabilityPercent));

        await Task.WhenAll(tasks);
    }

    static Config LoadConfig()
    {
        try
        {
            var json = File.ReadAllText("appsettings.json");
            return JsonSerializer.Deserialize<Config>(json) ?? new Config();
        }
        catch(Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($" Error loading config: {ex.Message}");
            Console.ResetColor();
            Environment.Exit(1);
            return new Config(); // Unreachable, but required for compilation
        }
    }

    static async Task SimulateDataset(DatasetConfigSim dataset, int driftProbability)
    {
        Directory.CreateDirectory(dataset.FolderPath);

        int fileIndex = 1;
        var rand = new Random();

        while (true)
        {
            string fileName = $"{dataset.Name}_{DateTime.Now:yyyyMMdd_HHmmss}_{fileIndex}.csv";
            string filePath = Path.Combine(dataset.FolderPath, fileName);

            // Decide schema
            var schema = new List<string>(dataset.BaseSchema);
            if (rand.Next(0, 100) < driftProbability)
            {
                schema = IntroduceSchemaDrift(schema, rand);
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"⚠ Drift introduced in {fileName}");
                Console.ResetColor();
            }

            // Write CSV
            using (var sw = new StreamWriter(filePath, false, Encoding.UTF8))
            {
                sw.WriteLine(string.Join(",", schema));
                for (int i = 0; i < 5; i++)
                {
                    var row = schema.Select(col => GenerateValue(col, rand)).ToArray();
                    sw.WriteLine(string.Join(",", row));
                }
            }

            Console.WriteLine($"📄 File generated: {filePath}");
            fileIndex++;
            await Task.Delay(TimeSpan.FromSeconds(dataset.FrequencySeconds));
        }
    }

    static List<string> IntroduceSchemaDrift(List<string> schema, Random rand)
    {
        var driftType = rand.Next(3); // 0=Add, 1=Remove, 2=Rename
        var newSchema = new List<string>(schema);

        switch (driftType)
        {
            case 0: // Add new column
                newSchema.Add("NewCol" + rand.Next(100));
                break;
            case 1: // Remove column
                if (newSchema.Count > 1)
                    newSchema.RemoveAt(rand.Next(newSchema.Count));
                break;
            case 2: // Rename column
                int idx = rand.Next(newSchema.Count);
                newSchema[idx] = newSchema[idx] + "_X";
                break;
        }
        return newSchema;
    }

    static string GenerateValue(string col, Random rand)
    {
        if (col.ToLower().Contains("id")) return rand.Next(1000, 9999).ToString();
        if (col.ToLower().Contains("date")) return DateTime.Now.AddDays(-rand.Next(30)).ToString("yyyy-MM-dd");
        if (col.ToLower().Contains("amount") || col.ToLower().Contains("price")) return rand.Next(10, 500).ToString();
        if (col.ToLower().Contains("region")) return new[] { "US", "EU", "APAC" }[rand.Next(3)];
        if (col.ToLower().Contains("name")) return "Name" + rand.Next(100);
        if (col.ToLower().Contains("email")) return $"user{rand.Next(100)}@test.com";
        if (col.ToLower().Contains("country")) return new[] { "USA", "UK", "India" }[rand.Next(3)];
        return "Val" + rand.Next(100);
    }
}

public class Config
{
    public List<DatasetConfigSim> Datasets { get; set; } = new();
    public int DriftProbabilityPercent { get; set; } = 20;
}

public class DatasetConfigSim
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FolderPath { get; set; } = string.Empty;
    public List<string> BaseSchema { get; set; } = new();
    public int FrequencySeconds { get; set; }
}
