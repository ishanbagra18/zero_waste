/**
 * Impact Analytics & Verified Carbon Accounting Service
 * Uses scientifically recognized conversion factors from the United Nations
 * Environment Programme (UNEP) and UN Food and Agriculture Organization (FAO).
 * 
 * Standards Cited:
 * - FAO (2019): 1 Meal equivalent = 0.42 kg (420g) of prepared food.
 * - UNEP Food Waste Index (2021/2024): 1 kg diverted surplus food prevents ~2.5 kg CO2e emissions.
 * - Water Footprint Network: 1 kg diverted food saves ~1,000 Liters of agricultural freshwater embedded footprint.
 */

export function calculateEcologicalImpact(totalWeightKg) {
  const weight = Math.max(0, Number(totalWeightKg) || 0);

  // Conversion constants
  const KG_PER_MEAL = 0.42; // FAO standard
  const CO2E_PER_KG = 2.5;  // UNEP standard
  const WATER_LITERS_PER_KG = 1000; // Water Footprint Network

  const mealsSaved = Math.round(weight / KG_PER_MEAL);
  const co2eSavedKg = Math.round(weight * CO2E_PER_KG * 10) / 10;
  const waterSavedLiters = Math.round(weight * WATER_LITERS_PER_KG);
  
  // Equivalent metrics for intuitive recruiter/user understanding
  const carKmEquivalent = Math.round(co2eSavedKg * 4.1); // ~0.24 kg CO2e per average passenger car km
  const treesPlantedEquivalent = Math.round((co2eSavedKg / 21.77) * 10) / 10; // ~21.77 kg CO2 absorbed per urban tree/year

  return {
    totalWeightKg: weight,
    mealsRedistributed: mealsSaved,
    carbonEmissionsPreventedKg: co2eSavedKg,
    waterConservedLiters: waterSavedLiters,
    equivalents: {
      passengerCarKmAvoided: carKmEquivalent,
      annualTreeAbsorptionEquivalent: treesPlantedEquivalent,
    },
    methodology: {
      mealFactor: "0.42 kg/meal (UN FAO standard)",
      carbonFactor: "2.5 kg CO2e/kg food (UNEP Food Waste Index)",
      waterFactor: "1,000 L freshwater/kg food (Water Footprint Network)",
    },
  };
}
