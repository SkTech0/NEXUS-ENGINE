# Nexus Loan Engine — Demo Scenarios

---

## Purpose

Demo scenarios for **Nexus Loan Engine** are used to show the product in action—typically in Playground or in sales demos. They illustrate lending flows and value without using real customer data.

---

## Scenario 1: Straight approve

- **Story**: Applicant with strong profile gets instant approve with clear reason.  
- **Inputs**: Sample application (income, employment, purpose—synthetic).  
- **Outputs**: Approve, limit/term, explanation (e.g., “Strong income and stability”).  
- **Demo angle**: Speed and clarity of automated approval.  

---

## Scenario 2: Decline with reason

- **Story**: Applicant outside policy gets decline with fair, explainable reason.  
- **Inputs**: Sample application that fails policy or model (synthetic).  
- **Outputs**: Decline, reason (e.g., “Income vs. obligation ratio”), optional next steps.  
- **Demo angle**: Explainability and fairness.  

---

## Scenario 3: Refer to human

- **Story**: Borderline case is referred for manual review.  
- **Inputs**: Sample application in “gray zone” (synthetic).  
- **Outputs**: Refer, explanation, optional queue/override flow.  
- **Demo angle**: Control and human-in-the-loop.  

---

## Scenario 4: Policy change impact

- **Story**: Same application under two policy settings to show impact.  
- **Inputs**: One sample application; two policy configs (e.g., stricter vs. relaxed).  
- **Outputs**: Different outcomes or limits; same explainability.  
- **Demo angle**: Lender control and consistency.  

---

## Scenario 5: Embedded in partner flow

- **Story**: Loan decision inside a checkout or partner app.  
- **Inputs**: Minimal application from partner context (synthetic).  
- **Outputs**: Decision + explanation in partner-ready format.  
- **Demo angle**: Embedded lending and integration.  

---

## Principles

- **No real data**: All scenarios use synthetic or anonymized sample data.  
- **Product narrative**: Each scenario supports the Loan Engine value story.  
- **Playground vs. product**: These scenarios may be run in Playground for demos; production logic lives in Loan Engine product scope.  

---

*Demo scenarios define “what we show.” Implementation follows product and platform boundaries.*
