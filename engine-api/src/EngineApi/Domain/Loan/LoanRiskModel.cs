namespace EngineApi.Domain.Loan;

/// <summary>
/// Domain risk model: computes a 0–100 risk score from application and platform outputs.
/// Does not modify platform logic; interprets application and response shapes only.
/// </summary>
public static class LoanRiskModel
{
    public static double ComputeRiskScore(
        LoanEvaluateRequest application,
        double? aiRiskOutput = null,
        double? trustConfidence = null)
    {
        double risk = 0;

        // Credit
        if (application.CreditScore <= 500) risk += 35;
        else if (application.CreditScore <= 600) risk += 22;
        else if (application.CreditScore <= 700) risk += 10;
        else if (application.CreditScore >= 750) risk -= 5;

        // Income-to-loan
        double ratio = application.Income > 0 ? application.LoanAmount / application.Income : 1.0;
        if (ratio > 0.5) risk += 15;
        else if (ratio > 0.3) risk += 8;

        // Existing debt
        if (application.ExistingLoans >= 3) risk += 15;
        else if (application.ExistingLoans >= 1) risk += 5;

        // Employment
        risk += application.EmploymentType?.ToLowerInvariant() switch
        {
            "full-time" => 0,
            "part-time" => 5,
            "self-employed" => 10,
            "contract" => 10,
            "freelance" => 12,
            _ => 5
        };

        // Risk flags
        int flags = application.RiskFlags?.Count ?? 0;
        risk += Math.Min(flags * 5, 20);

        // Blend with platform outputs when present
        if (aiRiskOutput.HasValue && double.IsFinite(aiRiskOutput.Value))
            risk = (risk + Math.Clamp(aiRiskOutput.Value, 0, 100)) / 2;
        if (trustConfidence.HasValue && double.IsFinite(trustConfidence.Value))
            risk = (risk + (1.0 - trustConfidence.Value) * 100) / 2;

        return Math.Clamp(Math.Round(risk, 0), 0, 100);
    }
}
