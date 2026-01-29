# Nexus Fraud Engine — Demo Scenarios

---

## Purpose

Demo scenarios for **Nexus Fraud Engine** are used to show the product in action—typically in Playground or in sales demos. They illustrate fraud/risk flows and value without using real customer data.

---

## Scenario 1: Low risk — allow

- **Story**: Transaction or entity with normal pattern gets low risk and allow.  
- **Inputs**: Sample transaction or entity (synthetic).  
- **Outputs**: Low score, allow, explanation (e.g., “Normal pattern, known entity”).  
- **Demo angle**: Speed and clarity of automated allow.  

---

## Scenario 2: High risk — flag or block

- **Story**: Transaction or entity with suspicious pattern gets high risk and flag/block.  
- **Inputs**: Sample transaction or entity that triggers risk (synthetic).  
- **Outputs**: High score, flag/block, explanation (e.g., “Velocity, new device, geography”).  
- **Demo angle**: Explainability and actionability.  

---

## Scenario 3: Refer for review

- **Story**: Borderline case is referred for manual review.  
- **Inputs**: Sample transaction or entity in “gray zone” (synthetic).  
- **Outputs**: Review, explanation, optional queue/override flow.  
- **Demo angle**: Control and human-in-the-loop.  

---

## Scenario 4: Threshold change impact

- **Story**: Same transaction under two threshold settings to show impact.  
- **Inputs**: One sample transaction; two threshold configs (e.g., strict vs. relaxed).  
- **Outputs**: Different outcomes (allow vs. review vs. block); same explainability.  
- **Demo angle**: Risk team control and consistency.  

---

## Scenario 5: Embedded in payment flow

- **Story**: Risk assessment inside a payment or onboarding flow.  
- **Inputs**: Minimal transaction or entity from partner context (synthetic).  
- **Outputs**: Score + flags + explanation in partner-ready format.  
- **Demo angle**: Integration and embedded risk.  

---

## Principles

- **No real data**: All scenarios use synthetic or anonymized sample data.  
- **Product narrative**: Each scenario supports the Fraud Engine value story.  
- **Playground vs. product**: These scenarios may be run in Playground for demos; production logic lives in Fraud Engine product scope.  

---

*Demo scenarios define “what we show.” Implementation follows product and platform boundaries.*
