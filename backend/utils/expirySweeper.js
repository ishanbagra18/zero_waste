import { Item } from "../models/item.model.js";

/**
 * Automated Expiry Sweeper Job
 * Periodically checks available items in the database that have passed their expiryDate
 * and automatically transitions their status to "expired".
 */
export const runExpirySweeper = async () => {
  try {
    const now = new Date();
    const result = await Item.updateMany(
      {
        status: "available",
        expiryDate: { $ne: null, $lte: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`⏰ [ExpirySweeper] Automatically marked ${result.modifiedCount} item(s) as 'expired'.`);
    }
  } catch (error) {
    console.error("❌ [ExpirySweeper] Error sweeping expired items:", error.message);
  }
};
