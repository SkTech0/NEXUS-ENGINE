namespace EngineApi.Domain.Loan;

/// <summary>
/// Domain policy engine: maps eligibility score and risk score to APPROVED / REVIEW / REJECTED.
/// Business rules live only in the domain layer.
/// </summary>
public static class LoanPolicyEngine
{
    public static LoanDecisionOutcome Decide(double eligibilityScore, double riskScore, LoanEvaluateRequest application)
    {
        bool highCredit = application.CreditScore >= 750;
        bool lowCredit = application.CreditScore < 600;
        bool mediumCredit = application.CreditScore >= 600 && application.CreditScore < 750;
        bool lowRisk = riskScore <= 35;
        bool highRisk = riskScore > 60;
        bool mediumRisk = riskScore > 35 && riskScore <= 60;

        double incomeToLoan = application.Income > 0 ? application.LoanAmount / application.Income : 1.0;

        if (highCredit && lowRisk && incomeToLoan <= 0.4)
            return LoanDecisionOutcome.Approved;
        if (highRisk || lowCredit)
            return LoanDecisionOutcome.Rejected;
        if (mediumCredit || mediumRisk || eligibilityScore >= 0.5)
            return LoanDecisionOutcome.Review;

        return LoanDecisionOutcome.Review;
    }

    public static IReadOnlyList<string> GetReasons(LoanEvaluateRequest application, LoanDecisionOutcome outcome)
    {
        var reasons = new List<string>();
        reasons.Add($"Credit score: {application.CreditScore} ({(application.CreditScore >= 750 ? "excellent" : application.CreditScore >= 600 ? "fair to good" : "below threshold")}).");
        if (application.Income > 0)
        {
            var pct = application.LoanAmount / application.Income * 100;
            reasons.Add($"Income-to-loan ratio: {pct:F1}% ({(pct <= 30 ? "healthy" : pct <= 50 ? "moderate" : "elevated")}).");
        }
        if (application.ExistingLoans > 0)
            reasons.Add($"Existing loans: {application.ExistingLoans}.");
        reasons.Add($"Employment: {application.EmploymentType}.");
        if (outcome == LoanDecisionOutcome.Approved)
            reasons.Add("Profile meets approval criteria with acceptable risk.");
        else if (outcome == LoanDecisionOutcome.Rejected)
            reasons.Add("Risk or eligibility thresholds not met.");
        else
            reasons.Add("Manual review recommended to confirm eligibility.");
        return reasons;
    }

    public static IReadOnlyList<string> GetConditions(LoanEvaluateRequest application, LoanDecisionOutcome outcome)
    {
        var conditions = new List<string>();
        if (outcome == LoanDecisionOutcome.Approved)
        {
            conditions.Add("Documentation to be verified per policy.");
            if (application.LoanAmount > 50_000) conditions.Add("Large loan: additional verification may apply.");
        }
        else if (outcome == LoanDecisionOutcome.Review)
        {
            conditions.Add("Human review required before final decision.");
            if (application.CreditScore < 700) conditions.Add("Credit score below preferred range.");
        }
        else
        {
            if (application.CreditScore < 600) conditions.Add("Credit score below minimum threshold.");
            conditions.Add("Applicant may reapply after improving eligibility.");
        }
        return conditions;
    }

    public static IReadOnlyList<string> GetSuggestedActions(LoanDecisionOutcome outcome)
    {
        return outcome switch
        {
            LoanDecisionOutcome.Approved => new[] { "Proceed with documentation and disbursement process." },
            LoanDecisionOutcome.Review => new[] { "Route to underwriting for manual review.", "Verify income and employment if not already done." },
            _ => new[]
            {
                "Inform applicant of decision and reasons.",
                "Suggest improving credit score or reducing debt before reapplying.",
                "Offer alternative products if applicable."
            }
        };
    }
}
