# Nexus Fraud Engine — User Personas

---

## 1. The risk operator / analyst

- **Goal**: Act on risk scores and flags quickly and correctly.  
- **Needs**: Clear score, flags, reason; optional queue and action (block/allow/escalate).  
- **Behavior**: Reviews queue, overrides when needed, uses product in daily ops.  
- **Success**: Fast, consistent handling of risk events with full audit trail.  

## 2. The risk / fraud lead

- **Goal**: Reduce fraud loss and manual review while keeping control.  
- **Needs**: Configurable thresholds, rules, actions; monitoring and audit views.  
- **Behavior**: Configures product, monitors performance, handles escalations.  
- **Success**: Fraud detection is consistent and explainable; regulators and auditors can verify.  

## 3. The compliance / audit lead

- **Goal**: Verify that risk decisions are consistent, explainable, and compliant.  
- **Needs**: Audit trail, explanation per decision, threshold visibility (as allowed).  
- **Behavior**: Reviews reports, samples, or export; may ask for specific decision trace.  
- **Success**: Can attest that the product supports compliance and investigations.  

## 4. The integration / tech owner (FinTech / GovTech / SaaS)

- **Goal**: Embed Fraud Engine into payment, onboarding, or ops with minimal friction.  
- **Needs**: Clear integration contract, docs, and support; stable behavior.  
- **Behavior**: Integrates API, tests flows, monitors in production.  
- **Success**: Fraud Engine is live in their flow with stable behavior.  

## 5. The end user (indirect)

- **Goal**: Legitimate transactions or accounts are not wrongly blocked.  
- **Needs**: (Indirect) Fair, explainable risk decisions so false positives are reviewable.  
- **Behavior**: May dispute block or flag; product may support appeal flow.  
- **Success**: Disputes are traceable and correctable where in scope.  

---

*Personas define who the product serves. They inform flows, features, and prioritization—not implementation details.*
