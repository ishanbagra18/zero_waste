import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateHaversineDistance, scoreItemForNGO } from "../services/matchingService.js";
import { optimizeVolunteerRoute } from "../services/routeOptimizer.js";
import { calculateEcologicalImpact } from "../services/impactService.js";

describe("🧠 Smart Matching Engine Unit Tests", () => {
  test("Haversine formula calculates known city distances accurately", () => {
    // Distance between Jaipur (26.9124, 75.7873) and Delhi (28.6139, 77.2090) ~ 238-245 km
    const dist = calculateHaversineDistance(26.9124, 75.7873, 28.6139, 77.2090);
    assert.ok(dist >= 230 && dist <= 250, `Distance ${dist}km should be within expected range`);
  });

  test("Score reflects high urgency when item expires in < 3 hours", () => {
    const urgentItem = {
      name: "Cooked Meals",
      foodType: "veg",
      isUrgent: true,
      expiryDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours remaining
      geoPoint: { coordinates: [75.7873, 26.9124] },
      vendor: { averageRating: 4.5 },
    };

    const ngoProfile = { latitude: 26.9124, longitude: 75.7873, dietPreference: "veg" };
    const result = scoreItemForNGO(urgentItem, ngoProfile);

    assert.equal(result.breakdown.urgency, 100, "Urgency score should be maxed out (100) for <=3h");
    assert.ok(result.totalScore >= 80, `Total score should be high (>80), received: ${result.totalScore}`);
  });

  test("Strict vegetarian NGO receives 0 dietary score for non-veg items", () => {
    const nonVegItem = {
      name: "Chicken Biryani Surplus",
      foodType: "non-veg",
      expiryDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
      geoPoint: { coordinates: [75.7873, 26.9124] },
      vendor: { averageRating: 4.5 },
    };

    const vegNgoProfile = { latitude: 26.9124, longitude: 75.7873, dietPreference: "veg" };
    const result = scoreItemForNGO(nonVegItem, vegNgoProfile);

    assert.equal(result.breakdown.dietary, 0, "Non-veg item must receive 0 dietary score for veg-only NGO");
  });
});

describe("🚴 Route Optimizer & TSP 2-Opt Heuristic Tests", () => {
  test("2-Opt optimization reduces or maintains total travel distance", () => {
    const startPoint = { lat: 26.9124, lon: 75.7873, label: "Volunteer Base" };
    const endPoint = { lat: 26.9400, lon: 75.8200, label: "Community Shelter" };

    // Deliberately disordered zigzag stops
    const stops = [
      { id: "A", name: "Far East Bakery", lat: 26.9300, lon: 75.8300 },
      { id: "B", name: "Near West Cafe", lat: 26.9150, lon: 75.7900 },
      { id: "C", name: "Middle Restaurant", lat: 26.9200, lon: 75.8050 },
    ];

    const plan = optimizeVolunteerRoute(startPoint, stops, endPoint);

    assert.ok(plan.orderedStops.length === 5, "Plan must contain start, 3 pickups, and delivery");
    assert.ok(
      plan.totalDistanceKm <= plan.naiveDistanceKm,
      `Optimized distance (${plan.totalDistanceKm}km) must be <= naive sequential distance (${plan.naiveDistanceKm}km)`
    );
    assert.equal(plan.orderedStops[0].type, "START");
    assert.equal(plan.orderedStops[plan.orderedStops.length - 1].type, "DELIVERY");
  });
});

describe("🌍 Ecological Impact Calculator Tests", () => {
  test("Converts 42 kg of surplus food to exact FAO and UNEP standard benchmarks", () => {
    const impact = calculateEcologicalImpact(42);

    // 42 kg / 0.42 kg per meal = 100 meals
    assert.equal(impact.mealsRedistributed, 100);
    // 42 kg * 2.5 kg CO2e = 105 kg CO2e
    assert.equal(impact.carbonEmissionsPreventedKg, 105);
    // 42 kg * 1000 Liters = 42,000 Liters
    assert.equal(impact.waterConservedLiters, 42000);
  });
});
