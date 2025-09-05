using System.Text.RegularExpressions;

namespace DriftDetectionServices
{
    public static class SchemaUtils
    {
        // Normalize header: trim, remove BOM, unify case
        public static IEnumerable<string> ParseHeader(string headerLine, char delimiter = ',')
        {
            if (string.IsNullOrWhiteSpace(headerLine)) yield break;

            // strip UTF8 BOM if present
            headerLine = Regex.Replace(headerLine, @"^\uFEFF", string.Empty);

            var parts = headerLine.Split(delimiter)
                .Select(p => p.Trim())
                .Where(p => !string.IsNullOrEmpty(p))
                .Select(p => p.ToLowerInvariant()); // normalize to lower-case
            foreach (var p in parts) yield return p;
        }

        // Try detect delimiter (common: comma, pipe, tab, semicolon)
        public static char DetectDelimiter(string headerLine)
        {
            if (headerLine.Contains(",")) return ',';
            if (headerLine.Contains("|")) return '|';
            if (headerLine.Contains("\t")) return '\t';
            if (headerLine.Contains(";")) return ';';
            return ','; // fallback
        }

        // Compare expected vs actual (both lists normalized to lower case)
        public static SchemaDiff CompareSchemas(IEnumerable<string> expected, IEnumerable<string> actual)
        {
            var expectedSet = new HashSet<string>(expected);
            var actualSet = new HashSet<string>(actual);

            var added = actualSet.Except(expectedSet).ToList();    // columns present in actual but not expected
            var removed = expectedSet.Except(actualSet).ToList();  // columns missing in actual

            // Heuristic renames: try to match by startswith/levenshtein? Simple heuristic: similar names (prefix)
            var potentialRenames = new List<(string From, string To)>();
            foreach (var r in removed.ToList())
            {
                var candidate = added.FirstOrDefault(a => a.StartsWith(r.Split('_').FirstOrDefault() ?? "", StringComparison.OrdinalIgnoreCase)
                                                         || r.StartsWith(a.Split('_').FirstOrDefault() ?? "", StringComparison.OrdinalIgnoreCase));
                if (!string.IsNullOrEmpty(candidate))
                {
                    potentialRenames.Add((r, candidate));
                    added.Remove(candidate);
                    removed.Remove(r);
                }
            }

            return new SchemaDiff
            {
                Added = added,
                Removed = removed,
                Renamed = potentialRenames
            };
        }
    }

    public class SchemaDiff
    {
        public List<string> Added { get; set; } = new List<string>();
        public List<string> Removed { get; set; } = new List<string>();
        public List<(string From, string To)> Renamed { get; set; } = new List<(string From, string To)>();
        public bool HasDrift => Added.Any() || Removed.Any() || Renamed.Any();
    }
}
