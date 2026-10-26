import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("🛡️ Concurrency & Atomic Claiming Race Condition Tests", () => {
  test("Atomic simulation guarantees only 1 of 2 simultaneous claims succeeds", async () => {
    // Shared simulated database state with atomic compare-and-swap semantics
    let dbItem = {
      _id: "item_999",
      name: "Surplus Fresh Meal Packs",
      status: "available",
      claimedBy: null,
      claimedAt: null,
    };

    /**
     * Simulates MongoDB findOneAndUpdate with condition { _id, status: 'available', claimedBy: null }
     */
    async function atomicClaimAttempt(ngoId, latencyMs) {
      // Simulate network jitter
      await new Promise((resolve) => setTimeout(resolve, latencyMs));

      // Atomic CAS Operation
      if (dbItem.status === "available" && dbItem.claimedBy === null) {
        dbItem.status = "claimed";
        dbItem.claimedBy = ngoId;
        dbItem.claimedAt = new Date();
        return { statusCode: 200, item: { ...dbItem } };
      }

      return {
        statusCode: 409,
        error: "RACE_CONDITION_CLAIM_CONFLICT",
        message: "Item already claimed by another organization.",
      };
    }

    const ngoA = "ngo_user_111";
    const ngoB = "ngo_user_222";

    // Launch both claim requests in parallel (simulating simultaneous HTTP PATCH /api/items/:id/claim)
    const [resA, resB] = await Promise.all([
      atomicClaimAttempt(ngoA, 10), // Finishes in 10ms
      atomicClaimAttempt(ngoB, 12), // Finishes in 12ms (races 2ms later)
    ]);

    // Exactly one must be 200 and the other must be 409 Conflict
    const statuses = [resA.statusCode, resB.statusCode].sort();
    assert.deepEqual(statuses, [200, 409], "One request must succeed (200) and the other must conflict (409)");

    // The winning organization must own the item exclusively
    assert.equal(dbItem.claimedBy, ngoA, "NGO A won the race and claimed the item");
    assert.equal(dbItem.status, "claimed", "Item status must be locked to 'claimed'");
  });
});
