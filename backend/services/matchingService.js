/**
 * Smart Matching Engine for ZeroWaste
 * Computes multi-objective compatibility scores between available surplus food
 * items and an NGO partner based on spatial proximity, urgency decay, dietary preference,
 * and historical reliability.
 */

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

/**
 * Computes composite match score for an item relative to an NGO profile.
 * 
 * Formula:
 * Score = w_proximity * S_dist + w_urgency * S_urgency + w_diet * S_diet + w_reliability * S_rel
 * 
 * Weights:
 * - Proximity: 0.35
 * - Expiry Urgency: 0.35
 * - Dietary Match: 0.15
 * - Vendor Reliability: 0.15
 * 
 * @param {Object} item 
 * @param {Object} ngoProfile 
 * @returns {Object} Score breakdown and total score (0 to 100)
 */
export function scoreItemForNGO(item, ngoProfile = {}) {
  const ngoLat = ngoProfile.latitude || 26.9124; // Default pilot center
  const ngoLon = ngoProfile.longitude || 75.7873;
  const preferredDiet = ngoProfile.dietPreference || "all"; // 'veg', 'non-veg', 'all'

  // 1. Proximity Score (Exponential distance decay, max 100 at 0km, ~20 at 15km)
  const itemCoords = item.geoPoint?.coordinates || [75.7873, 26.9124];
  const itemLon = itemCoords[0];
  const itemLat = itemCoords[1];
  const distanceKm = calculateHaversineDistance(ngoLat, ngoLon, itemLat, itemLon);
  const proximityScore = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-distanceKm / 7))));

  // 2. Expiry Urgency Score
  let urgencyScore = 50;
  let remainingHours = 24;
  if (item.expiryDate) {
    const diffMs = new Date(item.expiryDate) - new Date();
    remainingHours = Math.max(0.1, diffMs / (1000 * 60 * 60));
    if (remainingHours <= 3) {
      urgencyScore = 100; // Critical urgency: priority rescue
    } else if (remainingHours <= 6) {
      urgencyScore = 85;
    } else if (remainingHours <= 12) {
      urgencyScore = 70;
    } else if (remainingHours <= 24) {
      urgencyScore = 50;
    } else {
      urgencyScore = 30;
    }
  }
  if (item.isUrgent) {
    urgencyScore = Math.min(100, urgencyScore + 15);
  }

  // 3. Dietary Match Score
  let dietaryScore = 100;
  const foodType = (item.foodType || "veg").toLowerCase();
  if (preferredDiet === "veg" && foodType === "non-veg") {
    dietaryScore = 0; // Filter or hard penalty for strictly vegetarian shelters
  } else if (preferredDiet === foodType) {
    dietaryScore = 100;
  } else {
    dietaryScore = 80;
  }

  // 4. Vendor Reliability Score
  const vendorRating = item.vendor?.averageRating || 4.2;
  const reliabilityScore = Math.min(100, Math.round((vendorRating / 5) * 100));

  // Weights
  const wDist = 0.35;
  const wUrg = 0.35;
  const wDiet = 0.15;
  const wRel = 0.15;

  const totalScore = Math.round(
    wDist * proximityScore +
    wUrg * urgencyScore +
    wDiet * dietaryScore +
    wRel * reliabilityScore
  );

  return {
    totalScore,
    distanceKm,
    remainingHours: Math.round(remainingHours * 10) / 10,
    breakdown: {
      proximity: proximityScore,
      urgency: urgencyScore,
      dietary: dietaryScore,
      reliability: reliabilityScore,
    },
    recommendationReason: getRecommendationReason(distanceKm, remainingHours, item.isUrgent, totalScore),
  };
}

function getRecommendationReason(distanceKm, remainingHours, isUrgent, totalScore) {
  if (remainingHours <= 3 || isUrgent) {
    return `⚡ High Urgency: Item expires in ~${remainingHours}h, located only ${distanceKm} km away.`;
  }
  if (distanceKm <= 2.5) {
    return `📍 Ultra-Local: Located just ${distanceKm} km from your registered facility.`;
  }
  if (totalScore >= 80) {
    return `🌟 High Compatibility Match across distance, dietary alignment, and vendor reliability.`;
  }
  return `Balanced surplus match for community distribution.`;
}
