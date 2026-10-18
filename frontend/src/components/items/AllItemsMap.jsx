import React, { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Maximize2,
  Minimize2,
  Zap,
  Sparkles,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Eye,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Standard city coordinate dictionary for instant, reliable pin placement
const CITY_COORDINATES = {
  mumbai: [19.076, 72.8777],
  bandra: [19.0596, 72.8295],
  andheri: [19.1136, 72.8697],
  delhi: [28.6139, 77.209],
  "new delhi": [28.6139, 77.209],
  noida: [28.5355, 77.391],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  hyderabad: [17.385, 78.4867],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  surat: [21.1702, 72.8311],
  lucknow: [26.8467, 80.9462],
  chandigarh: [30.7333, 76.7794],
  indore: [22.7196, 75.8577],
  bhopal: [23.2599, 77.4126],
  kochi: [9.9312, 76.2673],
  nagpur: [21.1458, 79.0882],
  patna: [25.5941, 85.1376],
  vadodara: [22.3072, 73.1812],
  ghaziabad: [28.6692, 77.4538],
  ludhiana: [30.901, 75.8573],
  agra: [27.1767, 78.0081],
  nashik: [19.9975, 73.7898],
  varanasi: [25.3176, 82.9739],
};

// Deterministic pseudo-random offset so multiple items in one city don't hide each other
const getDeterministicOffset = (id = "") => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = (((hash % 100) - 50) / 100) * 0.045;
  const lngOffset = ((((hash >> 3) % 100) - 50) / 100) * 0.045;
  return [latOffset, lngOffset];
};

const resolveItemCoordinates = (item) => {
  if (item.coordinates && Array.isArray(item.coordinates) && item.coordinates.length === 2) {
    return item.coordinates;
  }
  if (item.lat && item.lng) {
    return [Number(item.lat), Number(item.lng)];
  }

  const rawLocation = (item.location || "").toLowerCase().trim();
  const [latOffset, lngOffset] = getDeterministicOffset(item._id || item.name || "");

  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (rawLocation.includes(cityName)) {
      return [coords[0] + latOffset, coords[1] + lngOffset];
    }
  }

  // Fallback centered on India with spread
  const defaultBase = [20.5937, 78.9629];
  return [defaultBase[0] + latOffset * 3, defaultBase[1] + lngOffset * 3];
};

// Determine status ring color strictly according to prompt specification:
// Urgent in Amber, Free in Emerald, Claimed in Blue
const getItemStatusRing = (item) => {
  const isClaimed =
    (item.status || "").toLowerCase() === "claimed" ||
    (item.claimStatus || "").toLowerCase() === "pending" ||
    (item.claimStatus || "").toLowerCase() === "approved" ||
    (item.deliveryStatus || "").toLowerCase() === "pickup_confirmed";

  if (isClaimed) {
    return {
      type: "claimed",
      label: "Claimed",
      ringColor: "#3b82f6", // Blue
      borderColor: "border-blue-400",
      bgColor: "bg-blue-500",
      haloClass: "ring-blue-500/40 shadow-[0_0_18px_rgba(59,130,246,0.8)]",
      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-400/40",
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `,
    };
  }

  // Urgent: marked isUrgent or expiry <= 12 hours
  const isUrgent =
    Boolean(item.isUrgent) ||
    (() => {
      if (!item.expiryDate) return false;
      const diffHours = (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 12;
    })();

  if (isUrgent) {
    return {
      type: "urgent",
      label: "Urgent Pickup",
      ringColor: "#f59e0b", // Amber
      borderColor: "border-amber-400",
      bgColor: "bg-amber-500",
      haloClass: "ring-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-400/40",
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      `,
    };
  }

  // Free: price === 0 or donation mode
  const isFree = !item.price || Number(item.price) === 0 || item.mode === "donation";
  if (isFree) {
    return {
      type: "free",
      label: "Free Donation",
      ringColor: "#10b981", // Emerald
      borderColor: "border-emerald-400",
      bgColor: "bg-emerald-500",
      haloClass: "ring-emerald-500/40 shadow-[0_0_18px_rgba(16,185,129,0.85)] animate-pulse",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      iconSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12v10H4V12"></path>
          <path d="M2 7h20v5H2z"></path>
          <path d="M12 22V7"></path>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      `,
    };
  }

  // Default available (Emerald ring variant)
  return {
    type: "free",
    label: "Available",
    ringColor: "#10b981",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-500",
    haloClass: "ring-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.7)]",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    iconSvg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    `,
  };
};

const createDonorPinIcon = (item) => {
  const ring = getItemStatusRing(item);

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
      <!-- Custom Outer Pulsing Status Ring -->
      <div 
        class="absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-125"
        style="
          border: 2.5px solid ${ring.ringColor};
          background-color: ${ring.ringColor}22;
          box-shadow: 0 0 16px ${ring.ringColor}99;
          animation: statusPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "
      ></div>

      <!-- Inner Core Pin -->
      <div 
        class="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#080d17] border-2 shadow-lg transition-transform duration-200 group-hover:scale-110"
        style="border-color: ${ring.ringColor};"
      >
        ${ring.iconSvg}
      </div>

      <!-- Small Bottom Marker Tail Pointer -->
      <div 
        class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0"
        style="
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${ring.ringColor};
        "
      ></div>
    </div>
  `;

  return L.divIcon({
    className: "custom-donor-pin",
    html,
    iconSize: [44, 48],
    iconAnchor: [22, 44],
    popupAnchor: [0, -42],
  });
};

function AutoFitBounds({ items }) {
  const map = useMap();

  React.useEffect(() => {
    if (!items || items.length === 0) return;
    try {
      const bounds = L.latLngBounds(
        items.map((it) => resolveItemCoordinates(it))
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    } catch (e) {
      console.warn("Could not fit map bounds:", e);
    }
  }, [items, map]);

  return null;
}

export default function AllItemsMap({
  items = [],
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const navigate = useNavigate();
  const [mapFilter, setMapFilter] = useState("all");

  const counts = useMemo(() => {
    let urgent = 0;
    let free = 0;
    let claimed = 0;

    items.forEach((item) => {
      const ring = getItemStatusRing(item);
      if (ring.type === "urgent") urgent++;
      else if (ring.type === "free") free++;
      else if (ring.type === "claimed") claimed++;
    });

    return { urgent, free, claimed, total: items.length };
  }, [items]);

  const displayedItems = useMemo(() => {
    if (mapFilter === "all") return items;
    return items.filter((item) => {
      const ring = getItemStatusRing(item);
      return ring.type === mapFilter;
    });
  }, [items, mapFilter]);

  const defaultCenter = [20.5937, 78.9629]; // India Center

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#080d17] shadow-2xl transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none h-screen w-screen"
          : "h-[620px] sm:h-[680px]"
      }`}
    >
      <style>{`
        @keyframes statusPing {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .leaflet-popup-content-wrapper {
          background: #0d1320 !important;
          color: #f8fafc !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 1.25rem !important;
          padding: 0 !important;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.8) !important;
          backdrop-filter: blur(12px) !important;
        }
        .leaflet-popup-tip {
          background: #0d1320 !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: normal !important;
        }
      `}</style>

      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Status Ring Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-xl pointer-events-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">
            Live Pins:
          </span>

          <button
            onClick={() => setMapFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mapFilter === "all"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>All ({counts.total})</span>
          </button>

          {/* Urgent in Amber */}
          <button
            onClick={() => setMapFilter("urgent")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mapFilter === "urgent"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-amber-300 hover:bg-amber-500/10"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
            <Zap size={13} />
            <span>Urgent ({counts.urgent})</span>
          </button>

          {/* Free in Emerald */}
          <button
            onClick={() => setMapFilter("free")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mapFilter === "free"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "text-emerald-300 hover:bg-emerald-500/10"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <Sparkles size={13} />
            <span>Free ({counts.free})</span>
          </button>

          {/* Claimed in Blue */}
          <button
            onClick={() => setMapFilter("claimed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mapFilter === "claimed"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "text-blue-300 hover:bg-blue-500/10"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <Package size={13} />
            <span>Claimed ({counts.claimed})</span>
          </button>
        </div>

        {/* Fullscreen & View Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 hover:border-emerald-400/40 text-xs font-bold text-white shadow-xl transition"
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen Map"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 size={15} className="text-emerald-400" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 size={15} className="text-emerald-400" />
                <span>Interactive Full-Screen Map</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Ring Legend (Bottom Overlay) */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-4 bg-slate-950/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-xl pointer-events-none">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Status Rings:
        </span>
        <div className="flex items-center gap-2 text-xs text-amber-300">
          <span className="w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
          <span className="font-semibold">Urgent (Amber)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-300">
          <span className="w-3 h-3 rounded-full border-2 border-emerald-400 bg-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="font-semibold">Free (Emerald)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-300">
          <span className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span className="font-semibold">Claimed (Blue)</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <AutoFitBounds items={displayedItems} />

        {/* Dark Matter CartoDB Basemap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Live Donor Pins */}
        {displayedItems.map((item) => {
          const coords = resolveItemCoordinates(item);
          const pinIcon = createDonorPinIcon(item);
          const ring = getItemStatusRing(item);

          return (
            <Marker key={item._id} position={coords} icon={pinIcon}>
              <Popup>
                <div className="w-64 p-3.5 space-y-3">
                  {/* Item Image with status badge */}
                  <div className="relative h-28 w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={
                        item.itemImage?.url ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${ring.badgeClass}`}
                      >
                        {ring.label}
                      </span>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {item.name || "Surplus Resource"}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={12} className="text-emerald-400 shrink-0" />
                      {item.location || "Location not stated"}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between text-xs border-t border-white/[0.08] pt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Quantity
                      </span>
                      <span className="font-bold text-slate-200">
                        {item.quantity || "1"} units
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Cost
                      </span>
                      <span className="font-bold text-emerald-400">
                        {!item.price || item.price == 0 ? "FREE" : `₹${item.price}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/vendor/item/${item._id}`)}
                    className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition shadow-md shadow-emerald-500/20"
                  >
                    <span>Inspect & Claim</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
