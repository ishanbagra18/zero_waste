/**
 * ZeroWaste End-to-End System & API Verification Test Suite
 * Tests every single endpoint, lifecycle state machine, and algorithmic engine
 * across all three stakeholder roles (Vendor, NGO, Volunteer).
 * 
 * Run via: node scripts/fullEndToEndTest.js
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import FormData from "form-data";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3002";

const DEMO_CREDENTIALS = {
  vendor: { email: "vendor.demo@zerowaste.org", password: "DemoPass@123", role: "vendor" },
  ngo: { email: "ngo.demo@zerowaste.org", password: "DemoPass@123", role: "NGO" },
  volunteer: { email: "volunteer.demo@zerowaste.org", password: "DemoPass@123", role: "Volunteer" },
};

let tokens = {};
let users = {};

const results = [];

function recordResult(stepName, status, details = "") {
  results.push({ stepName, status, details });
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${status}] ${stepName} ${details ? `— ${details}` : ""}`);
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = options.headers || {};
  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const fetchOptions = {
    method: options.method || "GET",
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(options.body);
  } else if (options.body instanceof FormData) {
    fetchOptions.body = options.body;
  }

  const res = await fetch(url, fetchOptions);
  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return { status: res.status, ok: res.ok, data };
}

async function runAllTests() {
  console.log("===============================================================");
  console.log("🧪 STARTING COMPLETE END-TO-END VERIFICATION ON ZEROWASTE STACK");
  console.log(`🌐 Target Server: ${BASE_URL}`);
  console.log("===============================================================\n");

  // -------------------------------------------------------------
  // TEST SUITE 1: System Health Probes
  // -------------------------------------------------------------
  console.log("--- 1. SYSTEM HEALTH & DIAGNOSTIC PROBES ---");
  try {
    const live = await request("/health/live");
    if (live.status === 200 && live.data.status === "healthy") {
      recordResult("Liveness Probe (/health/live)", "PASS", `Uptime: ${live.data.uptimeSeconds}s, Heap: ${live.data.process.heapUsedMb}MB`);
    } else {
      recordResult("Liveness Probe (/health/live)", "FAIL", `Status: ${live.status}`);
    }

    const ready = await request("/health/ready");
    if (ready.status === 200 && ready.data.status === "ready") {
      recordResult("Readiness Probe (/health/ready)", "PASS", `DB: ${ready.data.database.state}, Latency: ${ready.data.database.latencyMs}ms`);
    } else {
      recordResult("Readiness Probe (/health/ready)", "FAIL", `Status: ${ready.status}`);
    }
  } catch (err) {
    recordResult("Health Probes", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 2: Multi-Stakeholder Authentication
  // -------------------------------------------------------------
  console.log("\n--- 2. MULTI-STAKEHOLDER AUTHENTICATION ---");
  for (const [roleKey, creds] of Object.entries(DEMO_CREDENTIALS)) {
    try {
      const res = await request("/api/users/login", {
        method: "POST",
        body: creds,
      });

      if (res.status === 200 && res.data.token) {
        tokens[roleKey] = res.data.token;
        users[roleKey] = res.data.user;
        recordResult(`Auth Login (${roleKey.toUpperCase()})`, "PASS", `Token issued for ${creds.email}`);
      } else {
        recordResult(`Auth Login (${roleKey.toUpperCase()})`, "FAIL", res.data?.message || `Status: ${res.status}`);
      }
    } catch (err) {
      recordResult(`Auth Login (${roleKey.toUpperCase()})`, "FAIL", err.message);
    }
  }

  // Negative Auth Test: Bad credentials rejection
  try {
    const badLogin = await request("/api/users/login", {
      method: "POST",
      body: { email: "vendor.demo@zerowaste.org", password: "WrongPassword999!", role: "vendor" },
    });
    if (badLogin.status === 400 || badLogin.status === 401) {
      recordResult("Auth Security Check (Invalid Credentials Rejected)", "PASS", `HTTP ${badLogin.status}`);
    } else {
      recordResult("Auth Security Check (Invalid Credentials Rejected)", "FAIL", `Expected 400/401, got ${badLogin.status}`);
    }
  } catch (err) {
    recordResult("Auth Security Check", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 3: Surplus Item Publishing (Vendor Workflow)
  // -------------------------------------------------------------
  console.log("\n--- 3. SURPLUS ITEM PUBLISHING (VENDOR) ---");
  let createdItemId = null;
  try {
    // Create a 1x1 transparent PNG buffer for mock image upload
    const dummyPngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const form = new globalThis.FormData();
    form.append("name", "Artisan Multigrain Baguettes & Croissants");
    form.append("description", "Fresh surplus bakery items baked this morning. Sealed and food-safe.");
    form.append("category", "Food");
    form.append("foodType", "veg");
    form.append("quantity", "25");
    form.append("mode", "donation");
    form.append("price", "0");
    form.append("location", "C-Scheme, Jaipur, Rajasthan");
    form.append("status", "available");
    form.append("expiryDate", new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString()); // 5h left
    form.append("isUrgent", "false");

    const blob = new Blob([dummyPngBuffer], { type: "image/png" });
    form.append("itemImage", blob, "bakery.png");

    const createRes = await fetch(`${BASE_URL}/api/items/create-item`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.vendor}`,
      },
      body: form,
    });

    const createText = await createRes.text();
    let createData;
    try {
      createData = JSON.parse(createText);
    } catch {
      createData = { message: createText };
    }
    if (createRes.status === 201 && createData.item?._id) {
      createdItemId = createData.item._id;
      recordResult("Publish Surplus Item (POST /api/items/create-item)", "PASS", `Item ID: ${createdItemId}`);
    } else {
      recordResult("Publish Surplus Item", "FAIL", createData.message || `Status: ${createRes.status}`);
    }
  } catch (err) {
    recordResult("Publish Surplus Item", "FAIL", err.message);
  }

  // Fetch Vendor's Own Items
  try {
    const myItemsRes = await request("/api/items/my-items", { token: tokens.vendor });
    if (myItemsRes.status === 200 && Array.isArray(myItemsRes.data.items)) {
      recordResult("Vendor Inventory (GET /api/items/my-items)", "PASS", `Found ${myItemsRes.data.items.length} items`);
    } else {
      recordResult("Vendor Inventory", "FAIL", `Status: ${myItemsRes.status}`);
    }
  } catch (err) {
    recordResult("Vendor Inventory", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 4: Agentic FSSAI Food Safety Evaluation
  // -------------------------------------------------------------
  console.log("\n--- 4. AGENTIC AI & FSSAI COMPLIANCE CHECK ---");
  try {
    const safetyRes = await request("/api/items/food-safety-check", {
      method: "POST",
      token: tokens.vendor,
      body: {
        name: "Fresh Cooked Dal & Rice",
        category: "Cooked Meals",
        hoursSinceCooked: 2,
        ambientTempCelsius: 22,
        storageCondition: "Insulated Thermal Box",
      },
    });

    if (safetyRes.status === 200 && safetyRes.data.evaluation) {
      const evalResult = safetyRes.data.evaluation;
      recordResult(
        "FSSAI Food Safety Check (/api/items/food-safety-check)",
        "PASS",
        `Verdict: ${evalResult.verdict}, RiskScore: ${evalResult.riskScore}, FSSAI: ${evalResult.fssaiCitation}`
      );
    } else {
      recordResult("FSSAI Food Safety Check", "FAIL", safetyRes.data?.message || `Status: ${safetyRes.status}`);
    }
  } catch (err) {
    recordResult("FSSAI Food Safety Check", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 5: Demand & Surplus Forecasting Engine
  // -------------------------------------------------------------
  console.log("\n--- 5. AI DEMAND & SURPLUS FORECASTING ---");
  try {
    const forecastRes = await request("/api/items/demand-forecast", { token: tokens.ngo });
    if (forecastRes.status === 200 && forecastRes.data.forecast) {
      const f = forecastRes.data.forecast;
      recordResult(
        "Demand Forecasting (/api/items/demand-forecast)",
        "PASS",
        `Predicted: ~${f.predictedMeals} meals, Window: ${f.peakWindow}, Confidence: ${f.confidenceScore}%`
      );
    } else {
      recordResult("Demand Forecasting", "FAIL", forecastRes.data?.message || `Status: ${forecastRes.status}`);
    }
  } catch (err) {
    recordResult("Demand Forecasting", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 6: Multi-Criteria Smart Matching Engine (NGO)
  // -------------------------------------------------------------
  console.log("\n--- 6. SMART MATCHING & CAPACITY ENGINE ---");
  try {
    const matchRes = await request(
      "/api/items/smart-match?lat=26.9124&lon=75.7873&dietPreference=veg&capacity=50",
      { token: tokens.ngo }
    );

    if (matchRes.status === 200 && Array.isArray(matchRes.data.items)) {
      const topMatch = matchRes.data.items[0];
      const matchScore = topMatch?.smartMatch?.totalScore;
      recordResult(
        "Smart Matching Query (/api/items/smart-match)",
        "PASS",
        `Scored ${matchRes.data.items.length} items. Top Score: ${matchScore}/100, Reason: ${topMatch?.smartMatch?.recommendationReason}`
      );
    } else {
      recordResult("Smart Matching Query", "FAIL", matchRes.data?.message || `Status: ${matchRes.status}`);
    }
  } catch (err) {
    recordResult("Smart Matching Query", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 7: Geospatial Radius & GPS Geofencing
  // -------------------------------------------------------------
  console.log("\n--- 7. GEOSPATIAL 2DSPHERE & GEOFENCING ---");
  try {
    const geoRes = await request("/api/items/nearby?lat=26.9124&lon=75.7873&radiusKm=15", {
      token: tokens.ngo,
    });
    if (geoRes.status === 200 && Array.isArray(geoRes.data.items)) {
      recordResult("Geospatial Radius Query (/api/items/nearby)", "PASS", `Found ${geoRes.data.items.length} items within 15km`);
    } else {
      recordResult("Geospatial Radius Query", "FAIL", `Status: ${geoRes.status}`);
    }

    // Geofence Evaluation (Target in C-Scheme, Volunteer 300m away)
    const geofenceRes = await request("/api/items/geofence-check", {
      method: "POST",
      token: tokens.volunteer,
      body: {
        targetLat: 26.9124,
        targetLon: 75.7873,
        currentLat: 26.9145,
        currentLon: 75.7880,
        geofenceRadiusMeters: 500,
      },
    });

    if (geofenceRes.status === 200 && geofenceRes.data.geofence) {
      const gf = geofenceRes.data.geofence;
      recordResult(
        "GPS Geofencing Trigger (/api/items/geofence-check)",
        "PASS",
        `Inside: ${gf.isInside}, Status: ${gf.status}, Distance: ${gf.distanceMeters}m, ETA: ${gf.etaMinutes} min`
      );
    } else {
      recordResult("GPS Geofencing Trigger", "FAIL", geofenceRes.data?.message || `Status: ${geofenceRes.status}`);
    }
  } catch (err) {
    recordResult("Geospatial & Geofencing", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 8: Concurrency & Atomic Race Condition Claim
  // -------------------------------------------------------------
  console.log("\n--- 8. ATOMIC CAS CLAIM & RACE CONDITION TEST ---");
  if (createdItemId) {
    try {
      // Simulate 2 parallel simultaneous claims on createdItemId
      const [claim1, claim2] = await Promise.all([
        request(`/api/items/${createdItemId}/claim`, { method: "PATCH", token: tokens.ngo }),
        request(`/api/items/${createdItemId}/claim`, { method: "PATCH", token: tokens.ngo }),
      ]);

      const oneSucceeded = (claim1.status === 200 && claim2.status === 409) || (claim2.status === 200 && claim1.status === 409);
      if (oneSucceeded) {
        recordResult(
          "Atomic CAS Claim (Parallel Race Resolution)",
          "PASS",
          `Winner: HTTP 200 (Success) | Competitor: HTTP 409 (Race Conflict Prevented)`
        );
      } else {
        recordResult(
          "Atomic CAS Claim (Parallel Race Resolution)",
          "FAIL",
          `Claim1: ${claim1.status}, Claim2: ${claim2.status}`
        );
      }
    } catch (err) {
      recordResult("Atomic CAS Claim", "FAIL", err.message);
    }
  } else {
    recordResult("Atomic CAS Claim", "SKIP", "No created item ID to claim");
  }

  // -------------------------------------------------------------
  // TEST SUITE 9: Volunteer Route Optimization (TSP 2-Opt)
  // -------------------------------------------------------------
  console.log("\n--- 9. VOLUNTEER MULTI-STOP ROUTE OPTIMIZATION (TSP) ---");
  try {
    const routeRes = await request("/api/items/optimize-route", {
      method: "POST",
      token: tokens.volunteer,
      body: {
        startCoordinates: { lat: 26.9124, lon: 75.7873, label: "Volunteer Depot" },
        deliveryCoordinates: { lat: 26.9500, lon: 75.8200, label: "Robin Hood Food Relief" },
        pickups: [
          { id: "p1", name: "The Green Bakery", lat: 26.9350, lon: 75.8100 },
          { id: "p2", name: "Jaipur Club Kitchen", lat: 26.9180, lon: 75.7950 },
          { id: "p3", name: "Marriott Banquet Surplus", lat: 26.9280, lon: 75.8050 },
        ],
      },
    });

    if (routeRes.status === 200 && routeRes.data.optimizedRoute) {
      const r = routeRes.data.optimizedRoute;
      recordResult(
        "Volunteer TSP 2-Opt Solver (/api/items/optimize-route)",
        "PASS",
        `Stops: ${r.orderedStops.length}, Distance: ${r.totalDistanceKm}km (Reduced by ${r.savingsPercentage}% vs naive ${r.naiveDistanceKm}km)`
      );
    } else {
      recordResult("Volunteer TSP 2-Opt Solver", "FAIL", routeRes.data?.message || `Status: ${routeRes.status}`);
    }
  } catch (err) {
    recordResult("Volunteer TSP 2-Opt Solver", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 10: Lifecycle State Machine (Pickup -> Drop-Off OTP)
  // -------------------------------------------------------------
  console.log("\n--- 10. DELIVERY LIFECYCLE & DUAL-PHASE OTP STATE MACHINE ---");
  if (createdItemId) {
    try {
      // Step 0: Vendor approves the NGO claim
      const approveRes = await request(`/api/items/${createdItemId}/claim-status`, {
        method: "PATCH",
        token: tokens.vendor,
        body: { status: "approved" },
      });

      if (approveRes.status === 200) {
        recordResult("Lifecycle: Vendor Approves NGO Claim", "PASS", "Claim status transitioned to approved");
      } else {
        recordResult("Lifecycle: Vendor Approves NGO Claim", "FAIL", approveRes.data?.message || `Status: ${approveRes.status}`);
      }

      // Step A: Volunteer confirms pickup at vendor
      const pickupRes = await request(`/api/items/${createdItemId}/pickup-confirmed`, {
        method: "PATCH",
        token: tokens.volunteer,
      });

      if (pickupRes.status === 200 && pickupRes.data.otp) {
        const generatedOtp = pickupRes.data.otp;
        recordResult("Lifecycle: Pickup Confirmed & OTP Issued", "PASS", `Generated 6-digit OTP: ${generatedOtp}`);

        // Step B: Recipient NGO verifies OTP
        const verifyRes = await request(`/api/items/${createdItemId}/verify-otp`, {
          method: "PATCH",
          token: tokens.ngo,
          body: { otp: generatedOtp },
        });

        if (verifyRes.status === 200 && verifyRes.data.item?.status === "completed") {
          recordResult("Lifecycle: OTP Verified & Item Delivered", "PASS", `Item status atomically transitioned to: completed`);
        } else {
          recordResult("Lifecycle: OTP Verification", "FAIL", verifyRes.data?.message || `Status: ${verifyRes.status}`);
        }
      } else {
        recordResult("Lifecycle: Pickup Confirmation", "FAIL", pickupRes.data?.message || `Status: ${pickupRes.status}`);
      }
    } catch (err) {
      recordResult("Lifecycle State Machine", "FAIL", err.message);
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 11: Verified Ecological Impact Accounting
  // -------------------------------------------------------------
  console.log("\n--- 11. ECOLOGICAL IMPACT ACCOUNTING ---");
  try {
    const impactRes = await request("/api/items/impact-summary");
    if (impactRes.status === 200 && impactRes.data.impact) {
      const imp = impactRes.data.impact;
      recordResult(
        "Ecological Accounting (/api/items/impact-summary)",
        "PASS",
        `Meals: ${imp.mealsRedistributed}, CO2e Avoided: ${imp.carbonEmissionsPreventedKg}kg, Water Conserved: ${imp.waterConservedLiters}L`
      );
    } else {
      recordResult("Ecological Accounting", "FAIL", `Status: ${impactRes.status}`);
    }
  } catch (err) {
    recordResult("Ecological Accounting", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.status === "PASS").length;
  const failedTests = results.filter((r) => r.status === "FAIL").length;
  console.log(`🏁 TEST SUITE COMPLETED: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log("===============================================================");

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();
