# Nexus Loan Engine — Product Flows

---

## Primary flows

### 1. Applicant: apply and get decision

1. Applicant submits application (via lender’s app or channel).  
2. Loan Engine receives application and runs decision.  
3. Applicant receives outcome: approve / decline / refer.  
4. Applicant sees explanation (e.g., key factors, reason code).  
5. Optional: next steps (e.g., accept offer, upload docs, reapply later).  

### 2. Lender: configure and monitor

1. Lender configures product (policies, limits, referral rules—within product scope).  
2. Lender sends applications to Loan Engine (via integration).  
3. Lender sees decisions and explanations; optional dashboards and reports.  
4. Lender uses product for audit and compliance (explainability, trail).  

### 3. Lender: integrate Loan Engine

1. Lender adopts Loan Engine as decision layer.  
2. Integration: origination/system sends application data; Loan Engine returns decision + explanation.  
3. Lender’s UX shows outcome to applicant; optional appeal or referral flow.  

### 4. Referral and manual override

1. Decision is “refer” (e.g., borderline case).  
2. Referral is routed per lender config (e.g., underwriter queue).  
3. Optional: manual override with reason; product may record for audit.  

### 5. Appeal or dispute (product-defined)

1. Applicant or lender initiates appeal (if in scope).  
2. Product defines appeal flow: re-run with new data, manual review, or explanation-only.  
3. Outcome and explanation updated; audit trail preserved.  

## Flow principles

- **Applicant-centric outcome**: Every applicant gets a clear outcome and reason.  
- **Lender control**: Policy and referral behavior are configurable within product.  
- **Auditability**: Decisions and overrides are traceable for compliance.  

---

*Flows describe how users interact with the product. They are independent of technical APIs or system design.*
