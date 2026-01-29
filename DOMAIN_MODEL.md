# NEXUS — Domain Model

**The single source of truth for how domains relate to the platform and to products, and how multi-domain architecture works.**

---

## Domain vs Platform Separation

**Platform** = domain-agnostic capability. Decision core, data, optimization, trust, connectivity. It does not know what “lending” or “hiring” or “fraud” means—it provides the machinery.

**Domain** = a bounded area of business and logic. Lending, hiring, fraud, allocation. Each domain has its own concepts, rules, policies, and vocabulary. Domains sit *on top of* the platform; they specialize the platform for a specific problem space.

Separation is strict: the platform does not encode domain logic; domains do not reimplement platform capability. Domains consume the platform and add domain intelligence; the platform remains reusable across domains.

---

## What a Domain Engine Is

A **domain engine** is the **intelligence layer** for a domain. It contains the logic, rules, models, and policies that make decisions *in that domain*—approve/decline for lending, shortlist/reject for hiring, flag/block for fraud, allocate/schedule for allocation. It uses platform capability (reasoning, data, optimization, trust) but applies domain-specific semantics.

A domain engine is **not** a product. It has no user experience, no market positioning, no roadmap in the product sense. It is the **decision brain** for the domain. Products that serve that domain *use* the domain engine; they do not replace it.

---

## What a Domain Product Is

A **domain product** is the **user-facing value** for a domain. It has identity, experience, narrative, and roadmap. It uses the domain engine (and the platform) to deliver outcomes—loan decisions, hiring recommendations, fraud scores, allocation results—but it owns the *what* and *why* from the user’s perspective.

Example: **NEXUS Loan Engine** is a domain product for the **lending** domain. It uses the lending domain engine (and the platform) to deliver loan decisions; it owns the lending experience and the lending story.

Domain product ≠ domain engine. The engine is the how; the product is the what and the why.

---

## Domain Ownership Boundaries

- **Platform** owns: decision machinery, data access, optimization, trust, APIs, multi-tenancy. No domain-specific logic.
- **Domain engine** owns: domain concepts, rules, models, policies, and the logic that produces domain decisions. It does not own UX, narrative, or market.
- **Domain product** owns: experience, narrative, scope, roadmap, and the value proposition for that domain. It does not own the generic platform or the raw decision logic—it consumes them.

Ownership is clear so that evolution and accountability are unambiguous. Platform changes do not dictate product story; product changes do not dictate platform design; domain engine changes serve the domain and the products that use it.

---

## Domain Intelligence Concept

**Domain intelligence** is the knowledge and logic that makes a domain work: underwriting rules in lending, screening criteria in hiring, risk signals in fraud, constraints and objectives in allocation. It is encoded in the domain engine—rules, models, policies—and exposed through the domain product.

The platform provides **generic intelligence** (reasoning, inference, learning); the domain engine provides **domain intelligence** (what to reason about, what to optimize, what to explain). Together they produce decisions that are both powerful and domain-native.

---

## Domain Lifecycle

- **Definition:** A domain is identified by problem space and vocabulary (e.g. lending, hiring, fraud, allocation). Boundaries and concepts are defined.
- **Engine:** Domain intelligence is implemented in a domain engine—logic, rules, models—consuming the platform.
- **Product:** A domain product is defined—vision, scope, experience—and built on the domain engine and platform.
- **Evolution:** Domain engine and domain product evolve together; the domain engine supports the product roadmap, and the product drives demand for domain capability.
- **Reuse:** Domain engines can support multiple products in the same domain (e.g. different lending products for different segments); domain logic is reused, product experience varies.

Lifecycle is continuous: domains are refined as the market and product needs evolve.

---

## Domain Evolution

Domains evolve when:
- **Product needs change:** New workflows, new segments, new regulations—the domain product demands new capability from the domain engine.
- **Market norms shift:** Lending, hiring, fraud, and allocation practices change; the domain engine and product adapt.
- **Platform capability grows:** New platform features enable new domain logic or new product experiences.

Evolution is **additive where possible**: new rules, new models, new flows—without breaking existing behavior. Breaking changes are governed and communicated. Domain evolution is aligned with product roadmap and platform evolution.

---

## Domain Isolation Model

Domains are **isolated** from each other at the logic and concept level. Lending rules do not live in the hiring domain engine; fraud signals do not live in the allocation engine. Isolation ensures:

- **Clarity:** Each domain has a single place for its intelligence.
- **Safety:** Changes in one domain do not accidentally affect another.
- **Reuse:** Platform is shared; domain logic is not mixed.

Isolation does not mean no cross-domain use cases. A product or a workflow can *orchestrate* multiple domains (e.g. fraud check before loan decision)—but each domain’s intelligence stays in its own engine; orchestration is a separate concern.

---

## Domain Composition Model

**Composition** is how domains and products combine capability without merging logic. A workflow can call the lending domain engine and the fraud domain engine in sequence; a product can offer both lending and fraud as features. Composition happens at the **orchestration** or **product** layer—not by mixing domain engines.

The platform supports composition: shared identity, audit, and connectivity so that multi-domain flows are consistent and traceable. Domain engines remain focused; composition is explicit and designed.

---

## Domain Reuse Model

- **Platform reuse:** All domains reuse the same platform—decision, data, optimization, trust.
- **Domain engine reuse:** One domain engine can serve multiple products in that domain (e.g. one lending engine, multiple lending products for different segments or channels).
- **Cross-domain reuse:** Shared concepts (e.g. identity, risk) can be defined once and used across domains via the platform or shared contracts—without duplicating domain-specific logic.

Reuse reduces duplication and keeps evolution consistent. New domains and new products leverage what already exists.

---

## Multi-Domain Architecture

NEXUS is **multi-domain by design**. Multiple domains—lending, hiring, fraud, allocation—coexist on the same platform. Each has:

- A **domain engine** (intelligence, rules, models for that domain).
- One or more **domain products** (user-facing value for that domain).

The platform is the common substrate. Domains do not depend on each other; they depend on the platform. Products can span one domain or orchestrate several; the architecture supports both.

---

## Verticalization Strategy

**Verticalization** means going deep in a domain rather than staying generic. NEXUS verticalizes by:

- **Domain engines** that encode real domain intelligence—lending underwriting, hiring screening, fraud signals, allocation constraints—not shallow wrappers.
- **Domain products** that speak the language of that vertical—lenders, HR, risk teams, operations—and solve concrete problems.
- **Evolution with the vertical:** As lending, hiring, fraud, or allocation norms change, the domain engine and product evolve with them.

Verticalization is how NEXUS becomes the default choice in each domain—depth and relevance over breadth and generality.

---

## Examples

### Loan Domain

- **Domain:** Lending. Concepts: application, applicant, terms, risk, approve/decline/refer, explainability, policy, regulation.
- **Domain engine:** Lending decision logic—rules, models, policies for credit decisioning. Uses platform for reasoning, data, trust, audit.
- **Domain product:** NEXUS Loan Engine. Experience for lenders and applicants; narrative and roadmap for lending. Consumes the lending domain engine and the platform.
- **Value:** Fast, consistent, explainable loan decisions; control and compliance for lenders; clarity for applicants.

### Hiring Domain

- **Domain:** Hiring. Concepts: candidate, role, screening, shortlist, interview, hire, fairness, bias, explainability.
- **Domain engine:** Hiring decision logic—screening criteria, recommendation, fairness constraints. Uses platform for reasoning, data, trust, audit.
- **Domain product:** NEXUS Hiring Engine. Experience for HR and hiring managers; narrative and roadmap for hiring. Consumes the hiring domain engine and the platform.
- **Value:** Consistent, fair, explainable hiring support; time-to-hire and auditability for HR; clarity and fairness for candidates.

### Fraud Domain

- **Domain:** Fraud and risk. Concepts: transaction, entity, signal, score, flag, block, review, investigation, compliance.
- **Domain engine:** Fraud and risk logic—signals, models, thresholds, actions. Uses platform for reasoning, data, trust, audit.
- **Domain product:** NEXUS Fraud Engine. Experience for risk and operations teams; narrative and roadmap for fraud and risk. Consumes the fraud domain engine and the platform.
- **Value:** Fast, consistent, explainable fraud detection and prevention; reduced loss and manual review; traceability for regulators.

### Allocation Domain

- **Domain:** Allocation and scheduling. Concepts: resource, demand, constraint, objective, schedule, capacity, optimization.
- **Domain engine:** Allocation logic—constraints, objectives, solvers, schedulers. Uses platform for optimization, data, trust.
- **Domain product:** (Current or future NEXUS allocation product.) Experience for operations and planning; narrative and roadmap for allocation. Consumes the allocation domain engine and the platform.
- **Value:** Optimal or near-optimal allocation and scheduling under constraints; clarity and auditability of how resources are assigned.

---

## Summary

- **Domain vs platform:** Platform is domain-agnostic; domains specialize it.
- **Domain engine:** Intelligence layer for a domain—logic, rules, models. Not a product.
- **Domain product:** User-facing value for a domain—experience, narrative, roadmap. Uses domain engine and platform.
- **Ownership, isolation, composition, reuse:** Clear boundaries, no mixing of domain logic, explicit composition, reuse of platform and domain engine.
- **Multi-domain and verticalization:** Many domains on one platform; depth in each domain so NEXUS becomes the default choice.

This is the domain model—the conceptual backbone for how NEXUS organizes intelligence and value across lending, hiring, fraud, allocation, and beyond.

---

*This document is directional and strategic. It does not specify implementation; it defines how domains relate to the platform and to products.*
