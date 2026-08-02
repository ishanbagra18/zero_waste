import Notification from "../models/notification.model.js";

/**
 * Notification Queue System for ZeroWaste Backend
 * 
 * Provides asynchronous job processing for notification dispatching, MongoDB persistence,
 * real-time Socket.IO emission, and automatic retry management.
 */

class NotificationQueueManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.io = null;
    this.onlineUsers = null; // Reference to onlineUsers map from index.js
    this.maxRetries = 3;
    this.stats = {
      enqueued: 0,
      processed: 0,
      failed: 0,
    };
  }

  /**
   * Bind Socket.IO server instance and onlineUsers map
   */
  init({ io, onlineUsers }) {
    this.io = io;
    this.onlineUsers = onlineUsers;
    console.log("\n============================================================");
    console.log("⚡ [NOTIFICATION QUEUE SYSTEM] INITIALIZED & READY");
    console.log("============================================================\n");
  }

  /**
   * Enqueue a notification job
   * @param {Object} jobData 
   */
  async enqueue(jobData) {
    const job = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      data: jobData,
      attempts: 0,
      createdAt: new Date(),
    };

    this.queue.push(job);
    this.stats.enqueued++;

    console.log("\n============================================================");
    console.log("🚀 [MESSAGE QUEUE] NEW NOTIFICATION ENQUEUED");
    console.log(`📌 Job ID: ${job.id}`);
    console.log(`🏷️  Type:   ${jobData.notificationType || jobData.type || 'default'}`);
    if (jobData.userId) console.log(`👤 Target User ID: ${jobData.userId}`);
    if (jobData.message) console.log(`💬 Message: "${jobData.message}"`);
    console.log(`📊 Stats: Enqueued: ${this.stats.enqueued} | Pending in Queue: ${this.queue.length}`);
    console.log("============================================================\n");

    // Trigger processing if queue is idle
    this.processNext();
    return job.id;
  }

  /**
   * Process jobs sequentially with async non-blocking execution loop
   */
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      job.attempts++;

      try {
        console.log(`⚙️ [QUEUE WORKER] Processing Job ${job.id} (Attempt ${job.attempts}/${this.maxRetries})...`);
        await this.handleJob(job.data);
        this.stats.processed++;
        console.log(`✅ [QUEUE WORKER] Job ${job.id} PROCESSED SUCCESSFULLY VIA QUEUE!\n`);
      } catch (error) {
        console.error(`❌ [QUEUE WORKER] Job ${job.id} FAILED:`, error.message);
        
        if (job.attempts < this.maxRetries) {
          console.log(`🔁 [QUEUE WORKER] Re-enqueueing job ${job.id} for retry in ${job.attempts}s...`);
          setTimeout(() => {
            this.queue.push(job);
            this.processNext();
          }, job.attempts * 1000);
        } else {
          this.stats.failed++;
          console.error(`💀 [QUEUE WORKER] Job ${job.id} reached max retries (${this.maxRetries}) and was dropped.`);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Execute the actual notification creation/update and socket emission
   */
  async handleJob(payload) {
    const {
      type = "create", // "create" or "updateMany"
      userId,
      itemId,
      bookingId,
      notificationType,
      actionStatus = "pending",
      otpCode,
      userInfo,
      message,
      updateQuery,
      updateFields,
    } = payload;

    if (type === "updateMany") {
      if (updateQuery && updateFields) {
        console.log(`📝 [QUEUE WORKER] Batch updating notification records in MongoDB...`);
        const res = await Notification.updateMany(updateQuery, updateFields);
        console.log(`💾 [QUEUE WORKER] MongoDB updateMany complete. Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
      }
      return;
    }

    // Default: Create notification
    if (!userId || !message) {
      throw new Error("Missing required fields (userId or message) for notification creation");
    }

    const notification = await Notification.create({
      userId,
      itemId: itemId || null,
      bookingId: bookingId || null,
      notificationType: notificationType || "claim_request",
      actionStatus: actionStatus || "pending",
      otpCode: otpCode || null,
      userInfo: userInfo || {},
      message,
      isRead: false,
    });

    console.log(`💾 [QUEUE WORKER] Notification saved to MongoDB (DB ID: ${notification._id})`);

    // Real-time socket emission if user is online
    if (this.io && this.onlineUsers) {
      const socketId = this.onlineUsers.get(userId.toString());
      if (socketId) {
        this.io.to(socketId).emit("newNotification", {
          _id: notification._id,
          message: notification.message,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          itemId: notification.itemId,
          bookingId: notification.bookingId,
          notificationType: notification.notificationType,
          actionStatus: notification.actionStatus,
          otpCode: notification.otpCode,
          userInfo: notification.userInfo,
        });
        console.log(`📡 [QUEUE WORKER] Real-time Socket.IO emission sent to user ${userId} on socket ${socketId}`);
      } else {
        console.log(`ℹ️ [QUEUE WORKER] Target user ${userId} is currently offline (Notification stored in DB for fetch).`);
      }
    }
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      ...this.stats,
      pending: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }
}

export const notificationQueue = new NotificationQueueManager();

/**
 * Helper export function for easy enqueuing
 */
export const enqueueNotification = (jobData) => {
  return notificationQueue.enqueue(jobData);
};
