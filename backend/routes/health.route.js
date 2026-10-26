import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * 🟢 Liveness Probe (/health/live)
 * Lightweight check to confirm Node.js process is active and serving HTTP.
 */
router.get("/live", (req, res) => {
  const memory = process.memoryUsage();
  return res.status(200).json({
    status: "healthy",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      rssMemoryMb: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
    },
  });
});

/**
 * 🟡 Readiness Probe (/health/ready)
 * Deep health check: verifies database connection readiness and responsiveness.
 */
router.get("/ready", async (req, res) => {
  const startTime = Date.now();
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      return res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      });
    }

    // Ping MongoDB directly
    await mongoose.connection.db.admin().ping();
    const dbLatencyMs = Date.now() - startTime;

    return res.status(200).json({
      status: "ready",
      database: {
        state: "connected",
        latencyMs: dbLatencyMs,
        name: mongoose.connection.name,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      status: "unhealthy",
      database: "error",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
