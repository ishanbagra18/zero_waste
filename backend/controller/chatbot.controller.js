import { GoogleGenerativeAI } from "@google/generative-ai";
import { Item } from "../models/item.model.js";
import { evaluateFoodSafety } from "../services/foodSafetyAgent.js";
import { extractListingFromPhoto } from "../services/autoListingAgent.js";
import { generateMonthlyImpactReport } from "../services/impactReportAgent.js";

const websiteBaseContext = `
You are the official Agentic AI Assistant for **ZeroWasteHub** (Zero Waste), powered by LangGraph Multi-Agent Architecture.

CORE SUB-AGENTS & CAPABILITIES:
1. 🛡️ **Food Safety Agent**: Evaluates food viability grounded in official FSSAI (Recovery and Distribution of Surplus Food) Regulations 2019. Analyzes preparation time, temperature danger zones (5°C-60°C), ambient 4-hour limit, high-risk non-veg 2.5-hour limit, and visual inspection.
2. 📸 **Auto-Listing Vision Agent**: Vendor uploads an item photo, and AI Vision automatically estimates dish title, category, quantity (meals/kg), shelf-life hours, and storage protocols.
3. 📊 **Impact Report Agent**: Generates verified, auditable monthly ESG impact certificates calculating food diverted (kg), meals provided (0.42 kg/meal FAO standard), and CO2e emissions avoided (2.5 kg CO2e/kg UNEP standard).
4. 🧠 **Smart Matching & Geofence Agent**: Connects surplus items to NGOs using multi-objective optimization (Proximity 30%, Urgency 30%, Capacity 15%, Dietary 15%, Reliability 10%) with 500m live geofencing.
5. 🔒 **Atomic Concurrency & OTP Delivery**: Explains safe Compare-and-Swap item claiming and 6-digit OTP delivery verification.
`;

/**
 * Classifies user intent into specialized agent domains
 */
function classifyIntent(message = "", hasImage = false) {
  const normalized = message.toLowerCase();

  // 1. Food Safety Intent
  const safetyKeywords = [
    "safe", "safety", "fssai", "spoil", "expire", "fungus", "smell", "bad",
    "rotten", "hours ago", "cooked", "temperature", "danger zone", "khana khrab",
    "safe to eat", "safe to donate", "fssai rule", "poisoning", "kya yeh khana",
    "donate kar sakte", "donate kr skte", "safe hai", "safe h", "kharab", "khrab",
    "basi", "check karo", "audit karo", "inspect", "food safety", "food safety agent",
    "ghante", "ghanta", "hours", "hour", "shelf life", "shelf-life", "freshness"
  ];
  if (safetyKeywords.some((kw) => normalized.includes(kw))) {
    return "FOOD_SAFETY";
  }

  // 2. Auto-Listing Intent
  const listingKeywords = [
    "auto list", "auto-list", "auto listing", "list this", "create item", "photo se list",
    "identify food", "fill form", "new listing", "post surplus", "upload photo",
    "photo upload", "vision model", "auto-listing from photo", "listing banao",
    "khud bhar de", "item bana do"
  ];
  if (listingKeywords.some((kw) => normalized.includes(kw)) || (hasImage && !safetyKeywords.some((kw) => normalized.includes(kw)))) {
    return "AUTO_LIST";
  }

  // 3. Impact Report Intent
  const impactKeywords = [
    "impact", "monthly report", "report", "carbon", "co2", "emissions", "meals",
    "kitna khana", "kitne meals", "saved", "water footprint", "esg", "certificate",
    "trees", "diverted", "impact reports", "kitna kg bacha", "co2 saved",
    "conversion factor", "monthly impact", "bachaya", "bachi"
  ];
  if (impactKeywords.some((kw) => normalized.includes(kw))) {
    return "IMPACT_REPORT";
  }

  // 4. Surplus Inventory Search
  const inventoryKeywords = [
    "available", "surplus items", "active items", "food available",
    "kya available", "kya khana", "list items", "browse"
  ];
  if (inventoryKeywords.some((kw) => normalized.includes(kw))) {
    return "INVENTORY_SEARCH";
  }

  return "GENERAL_ASSISTANT";
}

/**
 * 🤖 Agentic Chatbot Controller
 * Dispatches requests to specialized LangGraph agents based on intent & multimodal attachments.
 */
export const chatWithBot = async (req, res) => {
  const { message = "", history = [], image = null } = req.body;
  const imageFile = req.files?.image || req.files?.itemImage || image;

  if (!message && !imageFile) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  const normalizedMessage = (message || "").toLowerCase();

  // Fast-path shortcut for zero-waste platform definition
  if (
    normalizedMessage.trim() === "zero waste" ||
    normalizedMessage.trim() === "zerowaste" ||
    normalizedMessage.trim() === "what is zerowaste"
  ) {
    return res.status(200).json({
      response: `ZeroWaste is an AI-powered municipal food recovery ecosystem connecting Restaurants & Food Businesses (Vendors), Shelters (NGOs), and Community Volunteers. It employs FSSAI-grounded Food Safety AI, Computer Vision Auto-Listing, TSP Route Optimization, and UNEP-verified Carbon Accounting to eliminate edible food waste.`,
      agentType: "PLATFORM_ASSISTANT",
    });
  }

  const intent = classifyIntent(message, !!imageFile);
  const BOT_API_KEY = process.env.BOT_API_KEY || process.env.GEMINI_API_KEY;

  try {
    // =========================================================
    // 🛡️ AGENT 1: Food Safety Agent (FSSAI RAG + Multimodal Vision)
    // =========================================================
    if (intent === "FOOD_SAFETY") {
      // Extract time parameter if present in query (e.g., "cooked 3 hours ago")
      const timeMatch = message.match(/(\d+(\.\d+)?)\s*(hour|hr|ghante|ghanta)/i);
      const hoursSinceCooked = timeMatch ? parseFloat(timeMatch[1]) : 2;

      // Extract category/type hints
      const isNonVeg = /chicken|meat|fish|egg|mutton|pork/i.test(message);
      const storageCondition = /fridge|refrigerat|chilled|cold/i.test(message) ? "Refrigerated (<5°C)" : "Ambient";

      const itemData = {
        name: message.length > 50 ? message.substring(0, 50) : message,
        category: "Food",
        foodType: isNonVeg ? "non-veg" : "veg",
        hoursSinceCooked,
        storageCondition,
        description: message,
      };

      const safetyEvaluation = await evaluateFoodSafety(itemData, imageFile);

      const verdictBadge =
        safetyEvaluation.verdict === "APPROVED_SAFE"
          ? "🟢 **APPROVED SAFE TO DONATE**"
          : safetyEvaluation.verdict === "CONDITIONAL_PICKUP_URGENT"
          ? "🟡 **CONDITIONAL: EXPEDITED PICKUP REQUIRED**"
          : "🔴 **REJECTED: UNSAFE FOR HUMAN CONSUMPTION**";

      const responseText = `### 🛡️ FSSAI Food Safety Audit Result
${verdictBadge}

**Safety Risk Score:** ${safetyEvaluation.riskScore}/100  
**Statutory Standard:** ${safetyEvaluation.fssaiCitation}

**📋 Inspector Reasoning:**
${safetyEvaluation.reasoning}

**💡 Mandatory Handling Protocols:**
${safetyEvaluation.recommendations.map((r) => `• ${r}`).join("\n")}

*Audited at: ${new Date(safetyEvaluation.evaluatedAt).toLocaleTimeString()} IST*`;

      return res.status(200).json({
        response: responseText,
        agentType: "FOOD_SAFETY",
        safetyData: safetyEvaluation,
      });
    }

    // =========================================================
    // 📸 AGENT 2: Auto-Listing Vision Agent
    // =========================================================
    if (intent === "AUTO_LIST" && imageFile) {
      const listing = await extractListingFromPhoto(imageFile);

      const responseText = `### 📸 AI Vision Auto-Listing Generated!
I inspected your surplus photo and extracted the following listing attributes:

• **Title:** ${listing.name}
• **Category:** ${listing.category} (${listing.foodType?.toUpperCase() || "VEG"})
• **Estimated Quantity:** ~${listing.quantity} ${listing.unit} (~${listing.estimatedWeightKg} kg)
• **Freshness Window:** Safe through **${new Date(listing.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}** (${listing.isUrgent ? "⚡ Urgent Pickup" : "Standard"})
• **Storage Recommendation:** ${listing.storageCondition}
• **Safety Status:** ${listing.safetyVerdict} (Confidence: ${Math.round(listing.confidenceScore * 100)}%)

**Description:**
*"${listing.description}"*

💡 *You can click "✨ Auto-Fill with AI Vision" directly on the [Post Surplus Item](/vendor/createitem) page to load these specs in 1 click!*`;

      return res.status(200).json({
        response: responseText,
        agentType: "AUTO_LIST",
        listingData: listing,
      });
    }

    // =========================================================
    // 📊 AGENT 3: Impact Report Agent (UNEP & FAO Grounded)
    // =========================================================
    if (intent === "IMPACT_REPORT") {
      const vendorId = req.user?.role === "vendor" ? req.user?._id : null;
      const report = await generateMonthlyImpactReport({
        vendorId,
        platformWide: !vendorId,
      });

      const imp = report.impact;
      const responseText = `### 📊 ZeroWaste Audited Impact Certificate
**Reporting Period:** ${report.reportingPeriod}  
**Organization:** ${report.donor.organisation} (${report.donor.city})

| Metric | Scientific Measurement | Standard Authority |
| :--- | :--- | :--- |
| 🥗 **Food Diverted** | **${imp.totalWeightKg} kg** | Municipal Weight Logs |
| 🍲 **Meals Provided** | **${imp.mealsRedistributed} meals** | UN FAO (0.42 kg/meal) |
| 🌱 **CO₂e Avoided** | **${imp.carbonEmissionsPreventedKg} kg CO₂e** | UNEP (2.5 kg CO₂e/kg) |
| 💧 **Freshwater Saved** | **${imp.waterConservedLiters.toLocaleString()} Liters** | Water Footprint Network |
| 🚗 **Car Travel Averted**| **${imp.equivalents.passengerCarKmAvoided} km** | EPA Passenger Car Factor |
| 🌳 **Trees Equivalent** | **${imp.equivalents.annualTreeAbsorptionEquivalent} trees/year** | Urban Canopy Standard |

**Executive ESG Summary:**
*"${report.executiveSummary}"*

**Official Citations:**
${report.citations.map((c) => `• ${c}`).join("\n")}`;

      return res.status(200).json({
        response: responseText,
        agentType: "IMPACT_REPORT",
        reportData: report,
      });
    }

    // =========================================================
    // 📦 AGENT 4: Live Surplus Inventory Search
    // =========================================================
    if (intent === "INVENTORY_SEARCH") {
      const activeItems = await Item.find({ status: "available" })
        .select("name description category quantity mode location price expiryDate isUrgent")
        .limit(6)
        .lean();

      if (!activeItems || activeItems.length === 0) {
        return res.status(200).json({
          response: "There are currently no unclaimed surplus items available in the live network. All items have been safely claimed by local NGOs! 🌱 Check back shortly as vendors post new surplus throughout the evening.",
          agentType: "INVENTORY_SEARCH",
        });
      }

      const itemsList = activeItems
        .map(
          (item, idx) =>
            `${idx + 1}. **${item.name}** [${item.category}] — ${item.quantity} portions | 📍 ${item.location}${item.isUrgent ? " | ⚡ **URGENT PICKUP**" : ""}${item.expiryDate ? ` | Expiry: ${new Date(item.expiryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ""}`
        )
        .join("\n\n");

      return res.status(200).json({
        response: `### ⚡ Active Surplus Items Ready for Claim\nHere are available surplus food items currently open for NGO requests in your district:\n\n${itemsList}\n\n👉 *NGOs can claim these directly via the [Live Marketplace](/vendor/allitems).*`,
        agentType: "INVENTORY_SEARCH",
        items: activeItems,
      });
    }

    // =========================================================
    // 🧭 AGENT 5: General Platform & Sustainability Assistant
    // =========================================================
    if (!BOT_API_KEY) {
      return res.status(200).json({
        response: `ZeroWasteHub coordinates food redistribution across Jaipur. You can inspect surplus items, check food safety against FSSAI rules, or auto-list surplus items from photos.`,
        agentType: "GENERAL_ASSISTANT",
      });
    }

    const candidateModels = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    const genAI = new GoogleGenerativeAI(BOT_API_KEY);

    const historyPrompt = (history || [])
      .slice(-4)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const fullPrompt = `${websiteBaseContext}

CONVERSATION HISTORY:
${historyPrompt || "None"}

USER QUERY:
${message}

Respond in concise, helpful Markdown format. If relevant, mention that users can ask for "Food Safety Check", "Auto-list from photo", or "Monthly Impact Report".`;

    for (const model of candidateModels) {
      try {
        const m = genAI.getGenerativeModel({ model });
        const result = await m.generateContent(fullPrompt);
        const reply = result.response.text();
        if (reply) {
          return res.status(200).json({
            response: reply,
            agentType: "GENERAL_ASSISTANT",
          });
        }
      } catch (e) {
        console.warn(`Chatbot model ${model} failed (${e.message}). Trying fallback...`);
      }
    }

    return res.status(200).json({
      response: `ZeroWaste connects food donors with shelters to eliminate waste. Ask me about food safety rules, monthly carbon impact reports, or active surplus items.`,
      agentType: "GENERAL_ASSISTANT",
    });

  } catch (error) {
    console.error("❌ Error in Agentic chatWithBot:", error);
    return res.status(500).json({
      error: `Agent execution failed: ${error.message || "Unknown error"}`,
    });
  }
};
