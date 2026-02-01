// Nexus Engine - Config Service
//
// Goals:
// - Centralized config resolution for .NET services.
// - Precedence model: defaults → env pack → secrets → runtime.
// - YAML parsing via YamlDotNet.
// - Provide a pluggable secrets resolver abstraction.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace NexusEngine.Config
{
    public interface ISecretsResolver
    {
        /// <summary>Resolve a secret by key (e.g. "ConnectionStrings:Primary").</summary>
        Task<string?> ResolveAsync(string key, CancellationToken ct = default);
    }

    public sealed class ConfigBundle
    {
        public Dictionary<string, object?> Appsettings { get; set; } = new();
        public Dictionary<string, object?> Engine { get; set; } = new();
        public Dictionary<string, object?> Ai { get; set; } = new();
        public Dictionary<string, object?> Observability { get; set; } = new();
        public Dictionary<string, object?> Security { get; set; } = new();
        public Dictionary<string, object?> Infra { get; set; } = new();
    }

    public sealed class ConfigService
    {
        private readonly string _repoRoot;

        public ConfigService(string repoRoot)
        {
            _repoRoot = repoRoot ?? throw new ArgumentNullException(nameof(repoRoot));
        }

        public async Task<ConfigBundle> LoadAsync(
            string env,
            IDictionary<string, object?>? defaults = null,
            ISecretsResolver? secretsResolver = null,
            IDictionary<string, object?>? runtimeOverrides = null,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(env))
                throw new ArgumentException("env must be provided", nameof(env));

            var envDir = Path.Combine(_repoRoot, "env", env);
            if (!Directory.Exists(envDir))
                throw new DirectoryNotFoundException($"Environment pack not found: {envDir}");

            // 1) defaults (optional)
            var bundle = new ConfigBundle();
            if (defaults != null)
            {
                // Scaffold: apply defaults to Appsettings only; extend as needed.
                foreach (var kv in defaults)
                    bundle.Appsettings[kv.Key] = kv.Value;
            }

            // 2) env pack documents
            bundle.Appsettings = ReadJson(Path.Combine(envDir, "appsettings.json"));
            bundle.Engine = ReadYaml(Path.Combine(envDir, "engine-config.yaml"));
            bundle.Ai = ReadYaml(Path.Combine(envDir, "ai-config.yaml"));
            bundle.Observability = ReadYaml(Path.Combine(envDir, "observability.yaml"));
            bundle.Security = ReadYaml(Path.Combine(envDir, "security.yaml"));
            bundle.Infra = ReadYaml(Path.Combine(envDir, "infra.yaml"));

            // 3) secrets injection (pattern scaffold)
            if (secretsResolver != null)
            {
                // Example injection: ConnectionStrings:Primary
                if (bundle.Appsettings.TryGetValue("ConnectionStrings", out var csObj) &&
                    csObj is Dictionary<string, object?> cs &&
                    cs.TryGetValue("Primary", out var primaryObj) &&
                    primaryObj is string primary &&
                    primary.StartsWith("OVERRIDE_WITH_ENVVAR_", StringComparison.OrdinalIgnoreCase))
                {
                    var injected = await secretsResolver.ResolveAsync("ConnectionStrings:Primary", ct);
                    if (!string.IsNullOrWhiteSpace(injected))
                        cs["Primary"] = injected;
                }
            }

            // 4) runtime overrides (optional)
            if (runtimeOverrides != null)
            {
                // Scaffold: shallow overlay onto Appsettings; extend to full deep merge when needed.
                foreach (var kv in runtimeOverrides)
                    bundle.Appsettings[kv.Key] = kv.Value;
            }

            return bundle;
        }

        private static Dictionary<string, object?> ReadJson(string filePath)
        {
            var json = File.ReadAllText(filePath);
            using var doc = JsonDocument.Parse(json);
            var root = ToObject(doc.RootElement) as Dictionary<string, object?>;
            return root ?? new Dictionary<string, object?>();
        }

        private static Dictionary<string, object?> ReadYaml(string filePath)
        {
            if (!File.Exists(filePath))
                return new Dictionary<string, object?> { ["__path__"] = filePath, ["__missing__"] = true };

            try
            {
                var yaml = File.ReadAllText(filePath);
                if (string.IsNullOrWhiteSpace(yaml))
                    return new Dictionary<string, object?>();
                var deserializer = new DeserializerBuilder()
                    .WithNamingConvention(CamelCaseNamingConvention.Instance)
                    .Build();
                var obj = deserializer.Deserialize<Dictionary<object, object>>(yaml);
                return ToDictionaryFromYaml(obj);
            }
            catch
            {
                return new Dictionary<string, object?> { ["__path__"] = filePath, ["__error__"] = "parse_failed" };
            }
        }

        private static Dictionary<string, object?> ToDictionaryFromYaml(Dictionary<object, object>? yamlDict)
        {
            if (yamlDict == null) return new Dictionary<string, object?>();
            var result = new Dictionary<string, object?>(StringComparer.Ordinal);
            foreach (var kv in yamlDict)
                result[kv.Key?.ToString() ?? ""] = ToDictionaryValue(kv.Value);
            return result;
        }

        private static object? ToDictionaryValue(object? v)
        {
            if (v == null) return null;
            if (v is Dictionary<object, object> d) return ToDictionaryFromYaml(d);
            if (v is System.Collections.IList list)
            {
                var arr = new List<object?>();
                foreach (var item in list) arr.Add(ToDictionaryValue(item));
                return arr;
            }
            return v;
        }

        private static object? ToObject(JsonElement el)
        {
            switch (el.ValueKind)
            {
                case JsonValueKind.Object:
                    var dict = new Dictionary<string, object?>(StringComparer.Ordinal);
                    foreach (var p in el.EnumerateObject())
                        dict[p.Name] = ToObject(p.Value);
                    return dict;
                case JsonValueKind.Array:
                    var list = new List<object?>();
                    foreach (var item in el.EnumerateArray())
                        list.Add(ToObject(item));
                    return list;
                case JsonValueKind.String:
                    return el.GetString();
                case JsonValueKind.Number:
                    if (el.TryGetInt64(out var l)) return l;
                    if (el.TryGetDouble(out var d)) return d;
                    return null;
                case JsonValueKind.True:
                    return true;
                case JsonValueKind.False:
                    return false;
                case JsonValueKind.Null:
                default:
                    return null;
            }
        }
    }
}

