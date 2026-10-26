# ADR 003: Agentic FSSAI Food Safety Evaluation via LangGraph

## Status
**Accepted & Implemented**

## Context
Food poisoning liability is the #1 reason commercial kitchens discard edible surplus rather than donating it. A basic text prompt in a chatbot lacks accountability, structured reasoning, and compliance with statutory standards.

## Decision
We implemented a dedicated **Food Safety Evaluation Agent** built with **LangGraph StateGraph** and **Google Gemini (1.5 Flash)** grounded in the official *FSSAI Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations, 2019*.

The workflow consists of:
1. **Deterministic Rule Engine (Node 1)**: Evaluates strict physical thresholds (e.g., cooked perishable food kept ambient > 4 hours is automatically flagged high risk).
2. **LLM Safety Synthesizer (Node 2)**: Synthesizes storage condition, sensory notes, and packaging integrity into a structured verdict:
   - `APPROVED_SAFE`
   - `CONDITIONAL_PICKUP_URGENT`
   - `REJECTED_UNSAFE`
   with numerical risk scores (0-100) and actionable handling protocols.

## Consequences
- **Positive:** Reassures donating vendors by providing a verifiable, auditable food safety check.
- **Positive:** Replaces hallucination-prone free-form chatbot answers with structured, deterministic safety gating.
- **Positive:** Fallback heuristic ensures safety decisions function reliably even during LLM API connectivity interruptions.
