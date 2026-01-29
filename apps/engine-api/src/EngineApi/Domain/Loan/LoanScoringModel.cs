namespace EngineApi.Domain.Loan;

/// <summary>
/// Domain scoring model: combines application data and platform outputs into a single eligibility score (0–1).
/// Does not contain platform logic; uses only application fields and platform response shapes.
/// </summary>
public static class LoanScoringModel
{
    public static double ComputeEligibilityScore(
        LoanEvaluateRequest application,
        double? engineScore = null,
        double? aiConfidence = null,
        double? intelligenceConfidence = null,
        bool? optimizationFeasible = null)
    {
        var parts = new List<double>();

        // Credit band (normalized 0–1)
        double creditNorm = application.CreditScore switch
        {
            >= 750 => 1.0,
            >= 700 => 0.85,
            >= 650 => 0.7,
            >= 600 => 0.5,
            >= 500 => 0.3,
            _ => 0.1
        };
        parts.Add(creditNorm);

        // Income-to-loan ratio (lower ratio = better)
        double incomeRatio = application.Income > 0
            ? application.LoanAmount / application.Income
            : 1.0;
        double ratioScore = incomeRatio <= 0.3 ? 1.0 : incomeRatio <= 0.5 ? 0.7 : incomeRatio <= 0.7 ? 0.4 : 0.2;
        parts.Add(ratioScore);

        // Existing loans (fewer = better)
        double existingScore = application.ExistingLoans switch
        {
            0 => 1.0,
            1 => 0.8,
            2 => 0.5,
            _ => 0.2
        };
        parts.Add(existingScore);

        // Employment stability (domain rule only)
        double empScore = application.EmploymentType?.ToLowerInvariant() switch
        {
            "full-time" => 1.0,
            "part-time" => 0.8,
            "self-employed" => 0.6,
            "contract" => 0.5,
            "freelance" => 0.5,
            _ => 0.6
        };
        parts.Add(empScore);

        if (engineScore.HasValue && double.IsFinite(engineScore.Value))
            parts.Add(Math.Clamp(engineScore.Value, 0, 1));
        if (aiConfidence.HasValue && double.IsFinite(aiConfidence.Value))
            parts.Add(Math.Clamp(aiConfidence.Value, 0, 1));
        if (intelligenceConfidence.HasValue && double.IsFinite(intelligenceConfidence.Value))
            parts.Add(Math.Clamp(intelligenceConfidence.Value, 0, 1));
        if (optimizationFeasible == true)
            parts.Add(0.9);
        else if (optimizationFeasible == false)
            parts.Add(0.5);

        if (parts.Count == 0) return 0.5;
        return parts.Average();
    }
}
