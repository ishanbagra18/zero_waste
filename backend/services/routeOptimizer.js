/**
 * Volunteer Multi-Pickup Route Optimization Engine
 * Solves the Traveling Salesperson / Vehicle Routing Problem (TSP/VRP)
 * for a volunteer collecting from multiple surplus vendors before dropping off at an NGO.
 * 
 * Algorithm:
 * 1. Computes all-pairs Haversine distance matrix.
 * 2. Generates initial greedy path using Nearest-Neighbor heuristic.
 * 3. Applies 2-Opt edge exchange optimization to untangle intersecting paths.
 */

import { calculateHaversineDistance } from "./matchingService.js";

/**
 * Computes the optimal pickup sequence for a volunteer run.
 * 
 * @param {Object} startPoint - Volunteer starting location { lat, lon, label }
 * @param {Array} pickupStops - Array of vendor pickups [{ id, name, lat, lon, item }]
 * @param {Object} endPoint - NGO drop-off location { lat, lon, label }
 * @returns {Object} Optimized route, ordered stops, total distance km, estimated savings
 */
export function optimizeVolunteerRoute(startPoint, pickupStops, endPoint) {
  if (!pickupStops || pickupStops.length === 0) {
    return {
      orderedStops: [],
      totalDistanceKm: 0,
      estimatedDurationMinutes: 0,
    };
  }

  // If only 1 stop, route is trivial: start -> pickup -> end
  if (pickupStops.length === 1) {
    const dist1 = calculateHaversineDistance(startPoint.lat, startPoint.lon, pickupStops[0].lat, pickupStops[0].lon);
    const dist2 = calculateHaversineDistance(pickupStops[0].lat, pickupStops[0].lon, endPoint.lat, endPoint.lon);
    const totalDist = Math.round((dist1 + dist2) * 100) / 100;
    return {
      orderedStops: [
        { ...startPoint, type: "START", step: 1 },
        { ...pickupStops[0], type: "PICKUP", step: 2, legDistanceKm: dist1 },
        { ...endPoint, type: "DELIVERY", step: 3, legDistanceKm: dist2 },
      ],
      totalDistanceKm: totalDist,
      estimatedDurationMinutes: Math.round(totalDist * 3.2), // ~20 km/h urban average + buffer
      optimizationEfficiency: "0% (Single Stop)",
    };
  }

  // Step 1: Initial unoptimized total distance (naive sequential order)
  const naiveDistance = computeTotalPathDistance(startPoint, pickupStops, endPoint);

  // Step 2: Nearest-Neighbor greedy initial solution
  let unvisited = [...pickupStops];
  let currentLoc = startPoint;
  let orderedPickups = [];

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateHaversineDistance(currentLoc.lat, currentLoc.lon, unvisited[i].lat, unvisited[i].lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    orderedPickups.push(unvisited[nearestIdx]);
    currentLoc = unvisited[nearestIdx];
    unvisited.splice(nearestIdx, 1);
  }

  // Step 3: 2-Opt Local Search Heuristic
  let improved = true;
  let iterations = 0;
  const maxIterations = 50;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < orderedPickups.length - 1; i++) {
      for (let k = i + 1; k < orderedPickups.length; k++) {
        const candidateRoute = twoOptSwap(orderedPickups, i, k);
        const currentDist = computeTotalPathDistance(startPoint, orderedPickups, endPoint);
        const newDist = computeTotalPathDistance(startPoint, candidateRoute, endPoint);

        if (newDist < currentDist) {
          orderedPickups = candidateRoute;
          improved = true;
        }
      }
    }
  }

  const optimizedDistance = computeTotalPathDistance(startPoint, orderedPickups, endPoint);
  const distanceSavedKm = Math.max(0, Math.round((naiveDistance - optimizedDistance) * 100) / 100);
  const percentSaved = naiveDistance > 0 ? Math.round((distanceSavedKm / naiveDistance) * 100) : 0;

  // Build annotated step list
  const orderedStops = [];
  orderedStops.push({ ...startPoint, type: "START", step: 1 });
  let prevCoord = startPoint;

  orderedPickups.forEach((stop, idx) => {
    const legDist = calculateHaversineDistance(prevCoord.lat, prevCoord.lon, stop.lat, stop.lon);
    orderedStops.push({
      ...stop,
      type: "PICKUP",
      step: idx + 2,
      legDistanceKm: legDist,
    });
    prevCoord = stop;
  });

  const finalLegDist = calculateHaversineDistance(prevCoord.lat, prevCoord.lon, endPoint.lat, endPoint.lon);
  orderedStops.push({
    ...endPoint,
    type: "DELIVERY",
    step: orderedStops.length + 1,
    legDistanceKm: finalLegDist,
  });

  return {
    orderedStops,
    totalDistanceKm: optimizedDistance,
    naiveDistanceKm: naiveDistance,
    distanceSavedKm,
    percentSaved: `${percentSaved}%`,
    estimatedDurationMinutes: Math.round(optimizedDistance * 3.2),
    algorithmUsed: "Nearest-Neighbor + 2-Opt Heuristic TSP Solver",
  };
}

function twoOptSwap(route, i, k) {
  const newRoute = route.slice(0, i);
  const reversedSub = route.slice(i, k + 1).reverse();
  const suffix = route.slice(k + 1);
  return newRoute.concat(reversedSub).concat(suffix);
}

function computeTotalPathDistance(startPoint, stops, endPoint) {
  let dist = 0;
  let curr = startPoint;
  for (const stop of stops) {
    dist += calculateHaversineDistance(curr.lat, curr.lon, stop.lat, stop.lon);
    curr = stop;
  }
  dist += calculateHaversineDistance(curr.lat, curr.lon, endPoint.lat, endPoint.lon);
  return Math.round(dist * 100) / 100;
}
