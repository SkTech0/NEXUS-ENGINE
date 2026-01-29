using System.Text.Json;
using System.Text.Json.Serialization;

namespace EngineApi.Domain.Loan;

/// <summary>
/// Result of the loan domain decision. Returned by POST /api/loan/evaluate.
/// </summary>
public sealed class LoanDecisionResult
{
    [JsonConverter(typeof(LoanDecisionOutcomeConverter))]
    public LoanDecisionOutcome Outcome { get; set; }
    public double RiskScore { get; set; }
    public double ConfidenceScore { get; set; }
    public IReadOnlyList<string> Reasons { get; set; } = Array.Empty<string>();
    public IReadOnlyList<string> Conditions { get; set; } = Array.Empty<string>();
    public IReadOnlyList<string> SuggestedActions { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Raw platform outputs for traceability (execute, infer, optimize, evaluate, trust).
    /// </summary>
    public LoanPipelineOutputs? Pipeline { get; set; }
}

public enum LoanDecisionOutcome
{
    Approved,
    Review,
    Rejected
}

internal sealed class LoanDecisionOutcomeConverter : JsonConverter<LoanDecisionOutcome>
{
    public override LoanDecisionOutcome Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var s = reader.GetString();
        return s?.ToUpperInvariant() switch
        {
            "APPROVED" => LoanDecisionOutcome.Approved,
            "REVIEW" => LoanDecisionOutcome.Review,
            "REJECTED" => LoanDecisionOutcome.Rejected,
            _ => LoanDecisionOutcome.Review
        };
    }

    public override void Write(Utf8JsonWriter writer, LoanDecisionOutcome value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value switch
        {
            LoanDecisionOutcome.Approved => "APPROVED",
            LoanDecisionOutcome.Review => "REVIEW",
            LoanDecisionOutcome.Rejected => "REJECTED",
            _ => "REVIEW"
        });
    }
}

/// <summary>
/// Captures platform engine outputs for audit and debugging.
/// </summary>
public sealed class LoanPipelineOutputs
{
    public object? Execute { get; set; }
    public object? Infer { get; set; }
    public object? Optimize { get; set; }
    public object? Evaluate { get; set; }
    public object? Trust { get; set; }
}
