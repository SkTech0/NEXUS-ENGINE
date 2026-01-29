# Nexus Hiring Engine — Demo Scenarios

---

## Purpose

Demo scenarios for **Nexus Hiring Engine** are used to show the product in action—typically in Playground or in sales demos. They illustrate hiring flows and value without using real candidate data.

---

## Scenario 1: Strong shortlist

- **Story**: Candidate with strong fit gets shortlist recommendation with clear reason.  
- **Inputs**: Sample candidate and role (skills, experience—synthetic).  
- **Outputs**: Shortlist, explanation (e.g., “Strong skills match and experience”).  
- **Demo angle**: Speed and clarity of automated recommendation.  

---

## Scenario 2: Not recommended with reason

- **Story**: Candidate outside criteria gets “not recommended” with fair, explainable reason.  
- **Inputs**: Sample candidate that does not meet role (synthetic).  
- **Outputs**: Not recommended, reason (e.g., “Skills gap in X”), optional feedback.  
- **Demo angle**: Explainability and fairness.  

---

## Scenario 3: Refer to human

- **Story**: Borderline candidate is referred for human review.  
- **Inputs**: Sample candidate in “gray zone” (synthetic).  
- **Outputs**: Refer, explanation, optional queue/override flow.  
- **Demo angle**: Control and human-in-the-loop.  

---

## Scenario 4: Criteria change impact

- **Story**: Same candidate under two role/criteria settings to show impact.  
- **Inputs**: One sample candidate; two role configs (e.g., stricter vs. relaxed).  
- **Outputs**: Different recommendations; same explainability.  
- **Demo angle**: HR control and consistency.  

---

## Scenario 5: Embedded in ATS flow

- **Story**: Hiring decision inside an ATS or HR app.  
- **Inputs**: Minimal candidate + role from ATS context (synthetic).  
- **Outputs**: Recommendation + explanation in ATS-ready format.  
- **Demo angle**: Integration and embedded hiring.  

---

## Principles

- **No real data**: All scenarios use synthetic or anonymized sample data.  
- **Product narrative**: Each scenario supports the Hiring Engine value story.  
- **Playground vs. product**: These scenarios may be run in Playground for demos; production logic lives in Hiring Engine product scope.  

---

*Demo scenarios define “what we show.” Implementation follows product and platform boundaries.*
