/**
 * GPS Live Tracking & Geofencing Engine for ZeroWaste
 * 
 * Implements MongoDB 2dsphere radius queries, spherical coordinate geofencing,
 * and live volunteer proximity triggers for automated physical handoff state transitions.
 */

import { calculateHaversineDistance } from "./matchingService.js";

/**
 * Evaluates whether a current volunteer position is within a target geofence perimeter.
 * 
 * @param {Object} params
 * @param {number} params.targetLat - Destination (vendor kitchen or NGO shelter)
 * @param {number} params.targetLon
 * @param {number} params.currentLat - Live GPS coordinates of volunteer
 * @param {number} params.currentLon
 * @param {number} [params.geofenceRadiusMeters=500] - Geofence radius boundary in meters
 * @returns {Object} Geofence evaluation verdict, distance in meters, and arrival ETA
 */
export function evaluateGeofence({
  targetLat,
  targetLon,
  currentLat,
  currentLon,
  geofenceRadiusMeters = 500,
}) {
  const distanceKm = calculateHaversineDistance(targetLat, targetLon, currentLat, currentLon);
  const distanceMeters = Math.round(distanceKm * 1000);
  const isInside = distanceMeters <= geofenceRadiusMeters;

  // Assume average urban electric scooter/bike delivery speed = 24 km/h (400 m/min)
  const etaMinutes = Math.max(1, Math.round(distanceMeters / 400));

  let status;
  let message;

  if (isInside) {
    status = "INSIDE_GEOFENCE";
    message = `🎯 Geofence Trigger: Partner is within ${distanceMeters}m of the destination. Ready for physical handoff.`;
  } else if (distanceMeters <= 2000) {
    status = "APPROACHING";
    message = `⚡ Inbound Proximity: Partner is ${distanceMeters}m away (~${etaMinutes} mins ETA).`;
  } else {
    status = "EN_ROUTE";
    message = `🚴 En Route: Distance to destination is ${distanceKm} km (~${etaMinutes} mins ETA).`;
  }

  return {
    isInside,
    distanceMeters,
    distanceKm,
    geofenceRadiusMeters,
    status,
    etaMinutes,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Queries all surplus items located within a circular geofence using MongoDB 2dsphere indexing.
 * 
 * @param {Object} ItemModel - Mongoose Item model
 * @param {number} centerLon - Longitude of geofence center
 * @param {number} centerLat - Latitude of geofence center
 * @param {number} radiusMeters - Geofence radius in meters (defaults to 5000m / 5km)
 * @returns {Promise<Array>} List of items physically situated inside the geofence
 */
export async function queryItemsInGeofence(ItemModel, centerLon, centerLat, radiusMeters = 5000) {
  const earthRadiusMeters = 6378100; // Earth mean radius in meters
  const radians = radiusMeters / earthRadiusMeters;

  return ItemModel.find({
    status: "available",
    geoPoint: {
      $geoWithin: {
        $centerSphere: [[centerLon, centerLat], radians],
      },
    },
  })
    .populate("vendor", "name email organisation location averageRating")
    .lean();
}
