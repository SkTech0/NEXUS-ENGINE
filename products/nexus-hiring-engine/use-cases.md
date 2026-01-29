# Nexus Hiring Engine — Use Cases

---

## UC-H1: Automated recommendation per candidate

**Actor**: Hiring manager or ATS.  
**Goal**: Get a consistent, explainable recommendation for each candidate.  
**Flow**: Submit candidate + role → Hiring Engine evaluates → return recommendation + explanation.  
**Outcome**: Recommendation and reason in one call; hiring manager uses in flow.  

## UC-H2: Candidate sees outcome (and optional reason)

**Actor**: Candidate.  
**Goal**: Know whether shortlisted, invited to interview, or not, and (if in scope) why.  
**Flow**: Candidate applies → receives outcome (e.g., via ATS) → sees explanation or feedback if allowed.  
**Outcome**: Clear, fair evaluation and next steps if any.  

## UC-H3: HR configures criteria and referral

**Actor**: HR or talent lead.  
**Goal**: Set role criteria, thresholds, and referral rules within the product.  
**Flow**: Access product config → set parameters (within product scope) → save; evaluations use new config.  
**Outcome**: Criteria applied without code changes.  

## UC-H4: Referral to human review

**Actor**: HR or hiring manager.  
**Goal**: Handle “refer” or borderline recommendations via human review.  
**Flow**: Recommendation is refer → routed to queue → hiring manager reviews → override or confirm with reason.  
**Outcome**: Edge cases get human review; override is recorded.  

## UC-H5: Audit and fairness review

**Actor**: Auditor or compliance.  
**Goal**: Trace and explain past recommendations.  
**Flow**: Request recommendation history or sample → view outcome, explanation, and (if allowed) criteria at time of decision.  
**Outcome**: Audit trail supports fairness and compliance.  

## UC-H6: Re-evaluate or appeal

**Actor**: Candidate or hiring manager.  
**Goal**: Re-evaluate after new information or dispute.  
**Flow**: Submit appeal or updated data → Hiring Engine re-evaluates (or manual review) → new recommendation and explanation.  
**Outcome**: Correctable errors or new data reflected; trail preserved.  

## UC-H7: Embedded in ATS / HR flow

**Actor**: ATS or HR system.  
**Goal**: Run Hiring Engine inside existing hiring workflow.  
**Flow**: ATS sends candidate + role to Hiring Engine → receives recommendation + explanation → shows in hiring manager UX.  
**Outcome**: Seamless hiring decision inside ATS/HR experience.  

---

*Use cases are product-level. They describe what users achieve; they do not specify APIs or components.*
