# Nexus Loan Engine — Use Cases

---

## UC-L1: Automated approve/decline/refer

**Actor**: Lender (system).  
**Goal**: Get a consistent, explainable decision for each application.  
**Flow**: Submit application → Loan Engine evaluates → return outcome + explanation.  
**Outcome**: Decision and reason in one call; lender presents to applicant.  

## UC-L2: Applicant sees decision and reason

**Actor**: Applicant.  
**Goal**: Know whether loan is approved, declined, or referred, and why.  
**Flow**: Applicant applies → receives outcome (e.g., in lender’s app) → sees explanation.  
**Outcome**: Clear, understandable result and next steps if any.  

## UC-L3: Lender configures policy

**Actor**: Risk or operations.  
**Goal**: Set limits, referral rules, and policy within the product.  
**Flow**: Access product config → set parameters (within product scope) → save; decisions use new config.  
**Outcome**: Policy is applied without code changes.  

## UC-L4: Referral to underwriter

**Actor**: Lender (operations).  
**Goal**: Handle “refer” decisions via manual review.  
**Flow**: Decision is refer → routed to queue → underwriter reviews → override or confirm with reason.  
**Outcome**: Borderline cases get human review; override is recorded.  

## UC-L5: Audit and compliance

**Actor**: Auditor or regulator.  
**Goal**: Trace and explain past decisions.  
**Flow**: Request decision history or sample → view outcome, explanation, and (if allowed) policy at time of decision.  
**Outcome**: Audit trail supports compliance and fairness review.  

## UC-L6: Re-run or appeal

**Actor**: Applicant or lender.  
**Goal**: Re-evaluate after new information or dispute.  
**Flow**: Submit appeal or updated data → Loan Engine re-evaluates (or manual review) → new outcome and explanation.  
**Outcome**: Correctable errors or new data reflected; trail preserved.  

## UC-L7: Embedded in partner journey

**Actor**: Partner (e.g., e-commerce, payroll).  
**Goal**: Offer loan decision in their flow.  
**Flow**: Partner sends application to Loan Engine → receives decision + explanation → shows in their UX.  
**Outcome**: Seamless lending decision inside partner experience.  

---

*Use cases are product-level. They describe what users achieve; they do not specify APIs or components.*
