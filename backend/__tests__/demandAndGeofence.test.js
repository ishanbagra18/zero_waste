import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { generateVendorSurplusForecast } from "../services/demandForecaster.js";
import { evaluateGeofence } from "../services/geofenceService.js";

describe("🔮 Demand & Surplus Forecasting Engine Tests", () => {
  test("Forecasts surplus window and meal count from historical vendor batches", () => {
    const mockVendorHistory = [
      { quantity: 25, category: "Cooked Meals", createdAt: new Date("2026-10-20T19:30:00Z") },
      { quantity: 20, category: "Cooked Meals", createdAt: new Date("2026-10-21T20:00:00Z") },
      { quantity: 30, category: "Bakery", createdAt: new Date("2026-10-22T19:15:00Z") },
    ];

    const forecast = generateVendorSurplusForecast("vendor_123", mockVendorHistory);

    assert.ok(forecast.predictedMeals >= 20, `Predicted meals should be >= 20, got: ${forecast.predictedMeals}`);
    assert.ok(forecast.confidenceScore >= 80, `Confidence should be >= 80%, got: ${forecast.confidenceScore}%`);
    assert.ok(forecast.peakWindow.includes(":"), "Peak window should be a valid time interval");
    assert.ok(forecast.topCategories.includes("Cooked Meals"), "Top categories should identify frequent item types");
  });

  test("Generates reasonable baseline forecast when historical samples are empty", () => {
    const forecast = generateVendorSurplusForecast("new_vendor", []);

    assert.ok(forecast.predictedMeals >= 15, "Baseline forecast should predict at least 15 meals");
    assert.equal(forecast.confidenceScore, 82, "Default baseline confidence should be 82%");
  });
});

describe("📍 GPS Geofencing & Proximity Trigger Tests", () => {
  test("Identifies partner as INSIDE_GEOFENCE when within 500m perimeter", () => {
    // Vendor kitchen at Jaipur C-Scheme (26.9124, 75.7873)
    const targetLat = 26.9124;
    const targetLon = 75.7873;

    // Volunteer position ~250m away
    const currentLat = 26.9140;
    const currentLon = 75.7885;

    const result = evaluateGeofence({
      targetLat,
      targetLon,
      currentLat,
      currentLon,
      geofenceRadiusMeters: 500,
    });

    assert.equal(result.isInside, true, "Volunteer should be inside 500m geofence");
    assert.equal(result.status, "INSIDE_GEOFENCE");
    assert.ok(result.distanceMeters <= 500, `Distance should be <= 500m, got ${result.distanceMeters}m`);
    assert.equal(result.etaMinutes, 1, "ETA inside geofence should be 1 minute");
  });

  test("Identifies partner as APPROACHING when between 500m and 2000m", () => {
    const targetLat = 26.9124;
    const targetLon = 75.7873;

    // Volunteer ~1.2 km away
    const currentLat = 26.9200;
    const currentLon = 75.7950;

    const result = evaluateGeofence({
      targetLat,
      targetLon,
      currentLat,
      currentLon,
      geofenceRadiusMeters: 500,
    });

    assert.equal(result.isInside, false, "Volunteer should not be inside 500m perimeter yet");
    assert.equal(result.status, "APPROACHING");
    assert.ok(result.distanceMeters > 500 && result.distanceMeters <= 2000);
  });
});
