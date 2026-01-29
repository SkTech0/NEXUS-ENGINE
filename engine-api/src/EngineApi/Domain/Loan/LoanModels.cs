using System.Text.Json.Serialization;

namespace EngineApi.Domain.Loan;

/// <summary>
/// Loan application input for the domain evaluate endpoint.
/// Matches the UI contract (camelCase); platform engines receive mapped parameters.
/// </summary>
public sealed class LoanEvaluateRequest
{
    [JsonPropertyName("fullName")]
    public string FullName { get; set; } = string.Empty;
    [JsonPropertyName("age")]
    public int Age { get; set; }
    [JsonPropertyName("income")]
    public double Income { get; set; }
    [JsonPropertyName("employmentType")]
    public string EmploymentType { get; set; } = "Full-time";
    [JsonPropertyName("company")]
    public string Company { get; set; } = string.Empty;
    [JsonPropertyName("creditScore")]
    public int CreditScore { get; set; }
    [JsonPropertyName("loanAmount")]
    public double LoanAmount { get; set; }
    [JsonPropertyName("loanTenure")]
    public int LoanTenure { get; set; }
    [JsonPropertyName("existingLoans")]
    public int ExistingLoans { get; set; }
    [JsonPropertyName("city")]
    public string City { get; set; } = string.Empty;
    [JsonPropertyName("country")]
    public string Country { get; set; } = string.Empty;
    [JsonPropertyName("riskFlags")]
    public IReadOnlyList<string>? RiskFlags { get; set; }
}
