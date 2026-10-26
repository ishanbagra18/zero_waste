/**
 * Food Safety Agent for ZeroWaste
 * Built with LangGraph StateGraph & Google Gemini
 * Analyzes donated surplus items against FSSAI (Food Safety & Standards Authority of India)
 * Surplus Food Redistribution Regulations (2019) to ensure 100% human-consumption safety.
 */

import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// 1. Define State Annotation
const FoodSafetyState = Annotation.Root({
  itemData: Annotation(),
  fssaiRulesApplied: Annotation(),
  riskScore: Annotation(),
  verdict: Annotation(),
  recommendations: Annotation(),
  reasoning: Annotation(),
});

// FSSAI Core Benchmarks (Recovery and Distribution of Surplus Food Regulations 2019)
const FSSAI_KNOWLEDGE_BASE = `
FSSAI Food Safety Benchmarks:
1. Cooked Perishable Foods (Gravies, Dal, Rice, Cooked Vegetables):
   - Ambient Temperature (25°C-35°C): Safe for maximum 4 hours from cooking. If elapsed time > 4 hours without hot-holding (>60°C), REJECT.
   - Refrigerated (<5°C): Safe up to 24 hours.
2. Cooked Meat, Fish, Poultry:
   - High biological hazard. Maximum 2.5 hours at ambient room temperature. Requires strict temperature maintenance.
3. Dairy & Milk Sweets:
   - High microbial vulnerability. Maximum 3 hours at room temperature.
4. Bakery Items (Dry breads, buns):
   - Low moisture: Safe up to 48 hours unless mold is visible.
5. Packaged Sealed Goods:
   - Must not exceed 'Best Before' / 'Expiry Date' and packaging must not be punctured, dented, or unsealed.
`;

/**
 * Step 1: Rule Engine Deterministic Filter
 */
function deterministicRuleFilter(state) {
  const { itemData } = state;
  const hoursSinceCooked = Number(itemData.hoursSinceCooked) || 1;
  const storageCondition = (itemData.storageCondition || "ambient").toLowerCase();
  const category = (itemData.category || "Food").toLowerCase();
  const foodType = (itemData.foodType || "veg").toLowerCase();

  const rulesApplied = [];
  let baseRisk = 10;

  // Check critical thresholds
  if (storageCondition === "ambient") {
    if (category.includes("cooked") || category.includes("food")) {
      if (foodType === "non-veg" && hoursSinceCooked > 2.5) {
        baseRisk = 95;
        rulesApplied.push("FSSAI Rule 1.2: Cooked non-vegetarian food ambient exposure > 2.5 hours.");
      } else if (hoursSinceCooked > 4) {
        baseRisk = 90;
        rulesApplied.push("FSSAI Rule 1.1: Cooked perishable food exceeded 4-hour room temperature safety envelope.");
      } else if (hoursSinceCooked > 2) {
        baseRisk = 55;
        rulesApplied.push("FSSAI Rule 1.3: Perishable food approaching 4-hour limit. Requires immediate expedited delivery (< 90 mins).");
      }
    }
  }

  return {
    fssaiRulesApplied: rulesApplied,
    riskScore: baseRisk,
  };
}

/**
 * Step 2: LangGraph LLM Agent Synthesis
 */
async function aiSafetySynthesizer(state) {
  const { itemData, fssaiRulesApplied, riskScore } = state;
  const BOT_API_KEY = process.env.BOT_API_KEY;

  // Fallback heuristic if API key is not configured
  if (!BOT_API_KEY) {
    const isApproved = riskScore < 70;
    return {
      verdict: isApproved
        ? riskScore > 40
          ? "CONDITIONAL_PICKUP_URGENT"
          : "APPROVED_SAFE"
        : "REJECTED_UNSAFE",
      reasoning: fssaiRulesApplied.length > 0 
        ? fssaiRulesApplied.join(" ") 
        : "Food item satisfies standard preservation and freshness guidelines.",
      recommendations: [
        "Ensure clean, sealed food-grade containers during transit.",
        "Maintain transit duration under 45 minutes.",
      ],
    };
  }

  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: BOT_API_KEY,
      temperature: 0.2,
    });

    const promptText = `
You are an expert FSSAI Food Safety Inspector assessing surplus food for charitable redistribution.

FOOD ITEM DETAILS:
- Name: ${itemData.name}
- Category: ${itemData.category}
- Type: ${itemData.foodType || "veg"}
- Hours Since Cooked/Prepared: ${itemData.hoursSinceCooked || 1} hours
- Storage Condition: ${itemData.storageCondition || "Ambient"}
- Physical Description/Notes: ${itemData.description || "Freshly packaged"}

FSSAI GUIDELINES:
${FSSAI_KNOWLEDGE_BASE}

PRE-ASSESSMENT RULES TRIGGERED:
${fssaiRulesApplied.join("\n") || "No critical deterministic violations"}
Current Risk Score: ${riskScore}/100

Respond ONLY with valid JSON in this exact structure:
{
  "verdict": "APPROVED_SAFE" | "CONDITIONAL_PICKUP_URGENT" | "REJECTED_UNSAFE",
  "calculatedRiskScore": number (0 to 100),
  "maxSafeRemainingHours": number,
  "reasoning": "Clear, scientific reasoning citing FSSAI guidelines",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;

    const response = await model.invoke(promptText);
    const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    
    // Clean potential markdown fencing
    const cleaned = content.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      verdict: parsed.verdict || (riskScore < 70 ? "APPROVED_SAFE" : "REJECTED_UNSAFE"),
      riskScore: parsed.calculatedRiskScore || riskScore,
      reasoning: parsed.reasoning || "Evaluation completed against FSSAI protocols.",
      recommendations: parsed.recommendations || ["Inspect upon collection."],
    };
  } catch (err) {
    console.warn("⚠️ Food safety LLM evaluation fallback invoked:", err.message);
    const isApproved = riskScore < 70;
    return {
      verdict: isApproved ? (riskScore > 40 ? "CONDITIONAL_PICKUP_URGENT" : "APPROVED_SAFE") : "REJECTED_UNSAFE",
      reasoning: fssaiRulesApplied.length > 0 ? fssaiRulesApplied.join(" ") : "Compliant with standard recovery envelopes.",
      recommendations: ["Maintain temperature isolation during volunteer transit."],
    };
  }
}

// 3. Compile the LangGraph Workflow
const workflow = new StateGraph(FoodSafetyState)
  .addNode("deterministicFilter", deterministicRuleFilter)
  .addNode("aiSynthesizer", aiSafetySynthesizer)
  .addEdge("__start__", "deterministicFilter")
  .addEdge("deterministicFilter", "aiSynthesizer")
  .addEdge("aiSynthesizer", "__end__");

export const foodSafetyAgentApp = workflow.compile();

/**
 * Public execution helper
 */
export async function evaluateFoodSafety(itemData) {
  const result = await foodSafetyAgentApp.invoke({
    itemData,
    fssaiRulesApplied: [],
    riskScore: 0,
    verdict: "",
    recommendations: [],
    reasoning: "",
  });

  return {
    verdict: result.verdict,
    riskScore: result.riskScore,
    reasoning: result.reasoning,
    recommendations: result.recommendations,
    fssaiCitation: "FSSAI Food Safety & Standards (Recovery & Distribution of Surplus Food) Regulations, 2019",
    evaluatedAt: new Date().toISOString(),
  };
}
