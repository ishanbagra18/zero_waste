import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFoodSafety } from "../services/foodSafetyAgent.js";
import { extractListingFromPhoto } from "../services/autoListingAgent.js";
import { calculateEcologicalImpact } from "../services/impactService.js";

test("🛡️ Food Safety Agent - FSSAI Rule Gating", async (t) => {
  await t.test("Rejects ambient perishable food exceeding 4 hours", async () => {
    const evaluation = await evaluateFoodSafety({
      name: "Cooked Dal Curry",
      category: "Food",
      foodType: "veg",
      hoursSinceCooked: 5, // > 4 hour limit
      storageCondition: "ambient",
    });

    assert.equal(evaluation.verdict, "REJECTED_UNSAFE");
    assert.ok(evaluation.riskScore >= 70);
    assert.ok(evaluation.reasoning.includes("FSSAI"));
  });

  await t.test("Approves freshly prepared cooked food under safe window", async () => {
    const evaluation = await evaluateFoodSafety({
      name: "Fresh Rice & Veg Gravy",
      category: "Food",
      foodType: "veg",
      hoursSinceCooked: 1, // Well within safe window
      storageCondition: "ambient",
    });

    assert.notEqual(evaluation.verdict, "REJECTED_UNSAFE");
    assert.ok(evaluation.riskScore < 70);
  });
});

test("📸 Auto-Listing Vision Agent - Schema Normalization", async (t) => {
  await t.test("Returns valid listing payload with auto-computed urgency and expiry", async () => {
    const listing = await extractListingFromPhoto(null);

    assert.ok(listing.name);
    assert.ok(listing.category);
    assert.ok(typeof listing.quantity === "number");
    assert.ok(listing.expiryDate);
    assert.equal(typeof listing.isUrgent, "boolean");
    assert.equal(listing.mode, "donation");
    assert.equal(listing.price, "0");
  });
});

test("📊 Impact Report Standards - UNEP & FAO Ecological Benchmarks", async (t) => {
  await t.test("Calculates correct UNEP CO2e, FAO meals, and water conservation", () => {
    const impact = calculateEcologicalImpact(100); // 100 kg

    // 100 kg / 0.42 kg = 238 meals
    assert.equal(impact.mealsRedistributed, 238);

    // 100 kg * 2.5 kg CO2e = 250 kg CO2e
    assert.equal(impact.carbonEmissionsPreventedKg, 250);

    // 100 kg * 1,000 L = 100,000 Liters
    assert.equal(impact.waterConservedLiters, 100000);

    // Methodologies cited
    assert.ok(impact.methodology.mealFactor.includes("FAO"));
    assert.ok(impact.methodology.carbonFactor.includes("UNEP"));
  });
});
