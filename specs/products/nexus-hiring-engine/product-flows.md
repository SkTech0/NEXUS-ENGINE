# Nexus Hiring Engine — Product Flows

---

## Primary flows

### 1. Hiring manager: evaluate candidate

1. Hiring manager (or ATS) submits candidate and role.  
2. Hiring Engine runs evaluation.  
3. Hiring manager receives recommendation: shortlist / interview / hire (or product-defined).  
4. Hiring manager sees explanation (e.g., fit factors, gaps).  
5. Optional: candidate feedback or next steps.  

### 2. HR / recruiter: configure and monitor

1. HR configures product (role criteria, thresholds, diversity/fairness—within product scope).  
2. HR or ATS sends candidate evaluations to Hiring Engine.  
3. HR sees recommendations and explanations; optional dashboards and reports.  
4. HR uses product for audit and fairness (explainability, trail).  

### 3. Integration: ATS sends candidate

1. ATS sends candidate and role to Hiring Engine.  
2. Hiring Engine returns recommendation + explanation.  
3. ATS shows result to hiring manager; optional feedback to candidate.  

### 4. Referral and human review

1. Recommendation is “borderline” or “refer to human.”  
2. Referral is routed per config (e.g., hiring manager queue).  
3. Optional: human override with reason; product may record for audit.  

### 5. Appeal or feedback (product-defined)

1. Candidate or hiring manager requests feedback or appeal (if in scope).  
2. Product defines flow: re-evaluate with new data, manual review, or explanation-only.  
3. Outcome and explanation updated; audit trail preserved.  

## Flow principles

- **Hiring manager-centric**: Every evaluation yields a clear recommendation and reason.  
- **HR control**: Criteria and referral behavior are configurable within product.  
- **Auditability**: Recommendations and overrides are traceable for fairness and compliance.  

---

*Flows describe how users interact with the product. They are independent of technical APIs or system design.*
