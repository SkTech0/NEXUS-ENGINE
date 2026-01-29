using System.Text.Json;
using EngineApi.DTOs;
using EngineApi.Services;
using Microsoft.Extensions.Configuration;

namespace EngineApi.Domain.Loan;

/// <summary>
/// Loan domain decision service. Orchestrates platform engines (Engine, AI, Optimization, Intelligence, Trust)
/// and applies domain business rules via LoanScoringModel, LoanRiskModel, LoanPolicyEngine.
/// No platform engine logic is modified; domain logic lives only here and in Loan* types.
/// </summary>
public sealed class LoanDecisionService
{
    private readonly IEngineService _engineService;
    private readonly IAIService _aiService;
    private readonly IOptimizationService _optimizationService;
    private readonly IIntelligenceService _intelligenceService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public LoanDecisionService(
        IEngineService engineService,
        IAIService aiService,
        IOptimizationService optimizationService,
        IIntelligenceService intelligenceService,
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration)
    {
        _engineService = engineService;
        _aiService = aiService;
        _optimizationService = optimizationService;
        _intelligenceService = intelligenceService;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<LoanDecisionResult> EvaluateAsync(LoanEvaluateRequest request, CancellationToken cancellationToken = default)
    {
        var parameters = ToParameters(request);

        // 1. Platform: Engine
        var engineReq = new EngineRequestDto("loan_decision", parameters);
        var engineRes = _engineService.Execute(engineReq);

        // 2. Platform: AI
        var aiReq = new AIInferenceRequestDto("default", parameters);
        var aiRes = _aiService.Infer(aiReq);

        // 3. Platform: Optimization
        var optConstraints = new Dictionary<string, double>
        {
            ["creditScore"] = request.CreditScore,
            ["incomeToLoan"] = request.Income > 0 ? request.LoanAmount / request.Income : 0,
            ["existingLoans"] = request.ExistingLoans
        };
        var optReq = new OptimizationRequestDto("loan_approval", "Maximize approval likelihood while minimizing risk", optConstraints);
        var optRes = _optimizationService.Optimize(optReq);

        // 4. Platform: Intelligence (with prior step outputs)
        var intelInputs = new Dictionary<string, object?>
        {
            ["application"] = parameters,
            ["engine"] = engineRes.Result,
            ["ai"] = aiRes.Outputs,
            ["optimization"] = new { optRes.TargetId, optRes.Value, optRes.Feasible }
        };
        var intelReq = new IntelligenceRequestDto("loan_approval", intelInputs);
        var intelRes = _intelligenceService.Evaluate(intelReq);

        // 5. Platform: Trust health (domain calls endpoint; no change to Trust API)
        (double? trustConfidence, object? trustPayload) = await GetTrustHealthAsync(cancellationToken).ConfigureAwait(false);

        // 6. Domain: extract values from platform responses (no platform logic change)
        double? engineScore = TryGetScore(engineRes.Result);
        double? aiConfidence = TryGetConfidence(aiRes.Outputs);
        double? aiRisk = TryGetRiskScore(aiRes.Outputs);

        double eligibilityScore = LoanScoringModel.ComputeEligibilityScore(
            request,
            engineScore,
            aiConfidence,
            intelRes.Confidence,
            optRes.Feasible);

        double riskScore = LoanRiskModel.ComputeRiskScore(request, aiRisk, trustConfidence);

        LoanDecisionOutcome outcome = LoanPolicyEngine.Decide(eligibilityScore, riskScore, request);

        double confidenceScore = DeriveConfidence(intelRes.Confidence, aiConfidence, trustConfidence, optRes.Feasible, engineRes.Status);

        var result = new LoanDecisionResult
        {
            Outcome = outcome,
            RiskScore = riskScore,
            ConfidenceScore = confidenceScore,
            Reasons = LoanPolicyEngine.GetReasons(request, outcome),
            Conditions = LoanPolicyEngine.GetConditions(request, outcome),
            SuggestedActions = LoanPolicyEngine.GetSuggestedActions(outcome),
            Pipeline = new LoanPipelineOutputs
            {
                Execute = engineRes.Result,
                Infer = aiRes.Outputs,
                Optimize = new { optRes.TargetId, optRes.Value, optRes.Feasible },
                Evaluate = new { intelRes.Outcome, intelRes.Confidence, intelRes.Payload },
                Trust = trustPayload
            }
        };

        return result;
    }

    private static IReadOnlyDictionary<string, object?> ToParameters(LoanEvaluateRequest r)
    {
        return new Dictionary<string, object?>
        {
            ["fullName"] = r.FullName,
            ["age"] = r.Age,
            ["income"] = r.Income,
            ["employmentType"] = r.EmploymentType,
            ["company"] = r.Company,
            ["creditScore"] = r.CreditScore,
            ["loanAmount"] = r.LoanAmount,
            ["loanTenure"] = r.LoanTenure,
            ["existingLoans"] = r.ExistingLoans,
            ["city"] = r.City,
            ["country"] = r.Country,
            ["riskFlags"] = r.RiskFlags ?? Array.Empty<string>()
        };
    }

    private async Task<(double? TrustConfidence, object? Payload)> GetTrustHealthAsync(CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient("Platform");
            var baseUrl = _configuration["Loan:TrustHealthBaseUrl"]?.TrimEnd('/');
            var url = string.IsNullOrEmpty(baseUrl) ? "api/Trust/health" : baseUrl + "/api/Trust/health";
            using var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
            if (!response.IsSuccessStatusCode) return (null, null);
            var json = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            double? conf = null;
            if (root.TryGetProperty("confidence", out var c) && c.ValueKind == JsonValueKind.Number)
                conf = c.GetDouble();
            return (conf, JsonSerializer.Deserialize<object>(json));
        }
        catch
        {
            return (null, null);
        }
    }

    private static double? TryGetScore(object? result)
    {
        if (result is null) return null;
        if (result is JsonElement je && je.TryGetProperty("score", out var s) && s.ValueKind == JsonValueKind.Number)
            return s.GetDouble();
        if (result is IReadOnlyDictionary<string, object?> d && d.TryGetValue("score", out var v) && v is double dbl)
            return dbl;
        return null;
    }

    private static double? TryGetConfidence(IReadOnlyDictionary<string, object?>? outputs)
    {
        if (outputs is null || !outputs.TryGetValue("confidence", out var v)) return null;
        if (v is double d) return d;
        if (v is JsonElement je && je.ValueKind == JsonValueKind.Number) return je.GetDouble();
        return null;
    }

    private static double? TryGetRiskScore(IReadOnlyDictionary<string, object?>? outputs)
    {
        if (outputs is null || !outputs.TryGetValue("riskScore", out var v)) return null;
        if (v is double d) return d;
        if (v is int i) return i;
        if (v is JsonElement je && je.ValueKind == JsonValueKind.Number) return je.GetDouble();
        return null;
    }

    private static double DeriveConfidence(double intelConfidence, double? aiConfidence, double? trustConfidence, bool optFeasible, string? engineStatus)
    {
        var parts = new List<double>();
        if (double.IsFinite(intelConfidence)) parts.Add(Math.Clamp(intelConfidence, 0, 1));
        if (aiConfidence.HasValue && double.IsFinite(aiConfidence.Value)) parts.Add(Math.Clamp(aiConfidence.Value, 0, 1));
        if (trustConfidence.HasValue && double.IsFinite(trustConfidence.Value)) parts.Add(Math.Clamp(trustConfidence.Value, 0, 1));
        if (optFeasible) parts.Add(0.85); else parts.Add(0.5);
        if (string.Equals(engineStatus, "ok", StringComparison.OrdinalIgnoreCase) || string.Equals(engineStatus, "success", StringComparison.OrdinalIgnoreCase))
            parts.Add(0.9);
        if (parts.Count == 0) return 0.5;
        return Math.Clamp(parts.Average(), 0, 1);
    }
}
