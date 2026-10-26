# ADR 001: Atomic Compare-and-Swap for Concurrency-Safe Surplus Claiming

## Status
**Accepted & Implemented**

## Context
In high-demand charitable food donation platforms, multiple NGOs often monitor the real-time surplus feed simultaneously. When a prominent vendor lists high-value or urgent meals, multiple NGO coordinators may click "Claim" within milliseconds of each other.

The legacy implementation performed:
1. `const item = await Item.findById(id);`
2. Application-level check: `if (item.status !== "available") return error;`
3. In-memory mutation: `item.status = "claimed"; item.claimedBy = req.user.id;`
4. `await item.save();`

Under concurrent traffic (proven by load testing and concurrency unit tests), two parallel requests both execute Step 1 & 2 before either finishes Step 4. Both proceed to claim the same food item, resulting in a dual-promise state where two physical pickup teams are dispatched to a single vendor.

## Decision
We adopted MongoDB's atomic document-level locking via `findOneAndUpdate` with composite query criteria:
```javascript
const claimedItem = await Item.findOneAndUpdate(
  {
    _id: itemID,
    status: "available",
    $or: [{ claimedBy: null }, { claimedBy: { $exists: false } }]
  },
  {
    $set: {
      status: "claimed",
      claimedBy: req.user.userId,
      claimStatus: "pending",
      claimedAt: new Date(),
    }
  },
  { new: true }
);
```

If `claimedItem` returns null, the engine performs a secondary lightweight read to distinguish:
- **404 Not Found**: Item does not exist.
- **409 Conflict (`RACE_CONDITION_CLAIM_CONFLICT`)**: Item was claimed milliseconds earlier by another organization.

## Consequences
- **Positive:** Zero chance of dual-claiming race conditions under high concurrency without requiring heavy distributed locks (e.g. Redlock).
- **Positive:** Recruiter & interviewer discussion point with empirical unit test proof in `__tests__/atomicClaim.test.js`.
- **Trade-off:** Losing organizations receive a clean `409 Conflict` and an immediate client-side notification toast.
