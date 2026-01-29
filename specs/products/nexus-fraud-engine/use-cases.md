# Nexus Fraud Engine — Use Cases

---

## UC-F1: Real-time risk assessment

**Actor**: Payment system or ops.  
**Goal**: Get a consistent, explainable risk score and flags for each transaction or entity.  
**Flow**: Submit transaction or entity → Fraud Engine assesses → return score + flags + explanation.  
**Outcome**: Risk outcome and reason in one call; calling system decides action.  

## UC-F2: Operator sees score and reason

**Actor**: Risk operator.  
**Goal**: Know why a transaction or entity was flagged and what to do.  
**Flow**: Operator sees queue or event → views score, flags, explanation → takes action (block/allow/escalate).  
**Outcome**: Clear, actionable risk decision and audit trail.  

## UC-F3: Risk team configures thresholds

**Actor**: Risk or fraud lead.  
**Goal**: Set thresholds, rules, and actions within the product.  
**Flow**: Access product config → set parameters (within product scope) → save; assessments use new config.  
**Outcome**: Policy applied without code changes.  

## UC-F4: Referral to analyst

**Actor**: Risk team (ops).  
**Goal**: Handle “review” or borderline cases via human review.  
**Flow**: Outcome is review → routed to queue → analyst reviews → override or confirm with reason.  
**Outcome**: Edge cases get human review; override is recorded.  

## UC-F5: Audit and compliance

**Actor**: Auditor or regulator.  
**Goal**: Trace and explain past risk decisions.  
**Flow**: Request assessment history or sample → view score, flags, explanation, and (if allowed) config at time of decision.  
**Outcome**: Audit trail supports compliance and investigations.  

## UC-F6: Re-run or dispute

**Actor**: Customer or operator.  
**Goal**: Re-assess after new information or dispute.  
**Flow**: Submit dispute or updated data → Fraud Engine re-assesses (or manual review) → new outcome and explanation.  
**Outcome**: Correctable errors or new data reflected; trail preserved.  

## UC-F7: Embedded in payment / onboarding

**Actor**: FinTech, GovTech, or SaaS.  
**Goal**: Run Fraud Engine inside payment, onboarding, or ops flow.  
**Flow**: System sends transaction or entity to Fraud Engine → receives score + flags + explanation → decides action in their flow.  
**Outcome**: Seamless fraud decision inside partner experience.  

---

*Use cases are product-level. They describe what users achieve; they do not specify APIs or components.*
