using Microsoft.AspNetCore.Mvc;

namespace EngineApi.Domain.Loan;

/// <summary>
/// Domain endpoint for loan decisions. Platform engines remain generic; this controller is part of the Loan domain module.
/// </summary>
[ApiController]
[Route("api/loan")]
public sealed class LoanController : ControllerBase
{
    private readonly LoanDecisionService _loanDecisionService;

    public LoanController(LoanDecisionService loanDecisionService)
    {
        _loanDecisionService = loanDecisionService;
    }

    /// <summary>
    /// Evaluates a loan application via the platform engines and domain business rules.
    /// POST /api/loan/evaluate
    /// </summary>
    [HttpPost("evaluate")]
    public async Task<ActionResult<LoanDecisionResult>> Evaluate([FromBody] LoanEvaluateRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
            return BadRequest("Request body is required.");

        var result = await _loanDecisionService.EvaluateAsync(request, cancellationToken).ConfigureAwait(false);
        return Ok(result);
    }
}
