# Nexus Fraud Engine — Product Flows

---

## Primary flows

### 1. Operator: assess transaction or entity

1. Transaction or entity is submitted (via payment system, onboarding, or ops).  
2. Fraud Engine runs risk assessment.  
3. Operator (or system) receives outcome: flag / block / review (or product-defined).  
4. Operator sees explanation (e.g., risk factors, reason code).  
5. Optional: action (block, allow, escalate) per product config.  

### 2. Risk team: configure and monitor

1. Risk team configures product (thresholds, rules, actions—within product scope).  
2. Risk team’s systems send transactions/entities to Fraud Engine.  
3. Risk team sees scores, flags, and explanations; optional dashboards and reports.  
4. Risk team uses product for audit and compliance (explainability, trail).  

### 3. Integration: payment/ops sends event

1. Payment or ops system sends transaction or entity to Fraud Engine.  
2. Fraud Engine returns risk score + flags + explanation.  
3. Calling system decides action (block, allow, review) per product config.  

### 4. Referral and manual review

1. Risk outcome is “review” (e.g., borderline).  
2. Referral is routed per config (e.g., analyst queue).  
3. Optional: manual override with reason; product may record for audit.  

### 5. Appeal or dispute (product-defined)

1. Customer or operator initiates dispute (if in scope).  
2. Product defines flow: re-run with new data, manual review, or explanation-only.  
3. Outcome and explanation updated; audit trail preserved.  

## Flow principles

- **Operator-centric outcome**: Every assessment yields a clear score, flags, and reason.  
- **Risk team control**: Thresholds and actions are configurable within product.  
- **Auditability**: Assessments and overrides are traceable for compliance and investigations.  

---

*Flows describe how users interact with the product. They are independent of technical APIs or system design.*
