import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Quote, Volume2, VolumeX, Shuffle, Copy, Check, Award, HeartHandshake } from "lucide-react";
import toast from "react-hot-toast";

// ZeroWaste & Sustainability Specific Quotes & Daily Tips
const ZEROWASTE_QUOTES = [
  {
    id: 1,
    quote: "Surplus food isn't waste—it's a resource waiting to nourish someone in need.",
    author: "ZeroWaste Mission",
    category: "Surplus Food Sharing",
    tip: "Tip: Connecting vendors directly with NGOs saves thousands of meals daily!"
  },
  {
    id: 2,
    quote: "The greatest threat to our planet is the belief that someone else will save it.",
    author: "Robert Swan",
    category: "Climate Action",
    tip: "Tip: Every item claimed on ZeroWaste directly reduces landfill methane gas."
  },
  {
    id: 3,
    quote: "We don't need a handful of people doing zero waste perfectly. We need millions doing it imperfectly.",
    author: "Anne-Marie Bonneau",
    category: "Community Impact",
    tip: "Tip: Small surplus donations add up to massive community support."
  },
  {
    id: 4,
    quote: "There is no such thing as 'away'. When we throw anything away, it must go somewhere.",
    author: "Annie Leonard",
    category: "Circular Economy",
    tip: "Tip: Always check if surplus items can be repurposed before disposal."
  },
  {
    id: 5,
    quote: "Refuse what you do not need; reduce what you do need; reuse what you consume; rot the rest.",
    author: "Bea Johnson",
    category: "5 R's of ZeroWaste",
    tip: "Tip: Vendors can list unused inventory for instant NGO claiming."
  },
  {
    id: 6,
    quote: "Waste isn't waste until we waste it. Food saved today is hope delivered tomorrow.",
    author: "ZeroWaste Pledge",
    category: "Food Preservation",
    tip: "Tip: Volunteer drivers help transport claimed surplus items rapidly."
  },
  {
    id: 7,
    quote: "Buy less, choose well, make it last. Share what remains.",
    author: "Vivienne Westwood",
    category: "Conscious Living",
    tip: "Tip: Check the ZeroWaste Dashboard daily for fresh surplus claims."
  },
  {
    id: 8,
    quote: "In nature, nothing is created, nothing is destroyed, everything is transformed.",
    author: "Antoine Lavoisier",
    category: "Transformation",
    tip: "Tip: ZeroWaste connects local vendors, NGOs, and transport volunteers."
  }
];

export default function EcoMascotQuote() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Deterministically compute "Quote of the Day" based on current date
  useEffect(() => {
    const todayStr = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = todayStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const dailyIndex = Math.abs(hash) % ZEROWASTE_QUOTES.length;
    setCurrentQuoteIndex(dailyIndex);
  }, []);

  // Character blinking eyes effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = ZEROWASTE_QUOTES[currentQuoteIndex];

  // Text-to-Speech using Browser Web Speech API
  const handleSpeakQuote = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Text-to-speech is not supported on your browser");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSay = `Captain Zero Waste says: ${currentQuote.quote} ... ${currentQuote.tip}`;
    const utterance = new SpeechSynthesisUtterance(textToSay);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleNextQuote = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    const nextIdx = (currentQuoteIndex + 1) % ZEROWASTE_QUOTES.length;
    setCurrentQuoteIndex(nextIdx);
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author} (via ZeroWaste)`);
    setCopied(true);
    toast.success("ZeroWaste Quote copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Vector Artwork of Captain ZeroWaste
  const MascotArtwork = () => (
    <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ZeroWaste Superhero Hero Cape */}
      <path
        d="M25 45 C15 65, 10 85, 22 90 C30 92, 45 75, 50 72 C55 75, 70 92, 78 90 C90 85, 85 65, 75 45 Z"
        fill="url(#capeGrad)"
        className="animate-pulse"
      />

      {/* Glowing Leaf Crown / Sprout */}
      <path d="M50 22 C50 8, 68 10, 62 20 C56 28, 50 22, 50 22 Z" fill="url(#leaf1)" />
      <path d="M50 22 C50 10, 32 12, 38 21 C44 29, 50 22, 50 22 Z" fill="url(#leaf2)" />

      {/* Head Body Structure */}
      <rect x="22" y="24" width="56" height="50" rx="25" fill="url(#bodyGrad)" stroke="#34d399" strokeWidth="2.5" />

      {/* Hero Mask / Visor Screen */}
      <rect x="28" y="34" width="44" height="28" rx="14" fill="#090d16" stroke="#10b981" strokeWidth="1.8" />

      {/* Hero Eyes */}
      {isBlinking ? (
        <>
          <line x1="36" y1="48" x2="44" y2="48" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="56" y1="48" x2="64" y2="48" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="40" cy="48" r="4.5" fill="#34d399" />
          <circle cx="41.5" cy="46.5" r="1.5" fill="#ffffff" />

          <circle cx="60" cy="48" r="4.5" fill="#34d399" />
          <circle cx="61.5" cy="46.5" r="1.5" fill="#ffffff" />
        </>
      )}

      {/* Friendly Smile */}
      <path d="M45 55 Q50 59 55 55" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ZeroWaste Shield Chest Emblem */}
      <circle cx="50" cy="65" r="7" fill="#10b981" stroke="#34d399" strokeWidth="1" />
      <path d="M47 64 L50 61 L53 64 M53 66 L50 69 L47 66" stroke="#042f2e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGrad" x1="22" y1="24" x2="78" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="1" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id="capeGrad" x1="50" y1="45" x2="50" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="leaf1" x1="50" y1="8" x2="68" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="leaf2" x1="32" y1="10" x2="50" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Render purely as Footer End-of-Page Mascot Banner
  return (
    <div className="w-full bg-slate-900/90 border-t border-b border-emerald-500/30 py-8 px-4 sm:px-8 relative overflow-hidden my-6 rounded-3xl shadow-2xl backdrop-blur-xl">
      {/* Background glow orbs */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Captain ZeroWaste Character Badge */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative p-1.5 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-xl shadow-emerald-950/60 flex-shrink-0"
          >
            <MascotArtwork />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center border border-slate-950 shadow">
              ZW
            </span>
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Captain ZeroWaste
                <Award className="w-4 h-4 text-emerald-400" />
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Official Mascot
              </span>
            </div>
            <p className="text-xs text-emerald-400/90 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Daily Quote of the Day & Sustainability Wisdom
            </p>
          </div>
        </div>

        {/* Quote Banner Box */}
        <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 relative shadow-inner">
          <Quote className="absolute top-2 right-3 w-8 h-8 text-emerald-500/10 pointer-events-none" />
          
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
              Today's Quote
            </span>
            <span className="text-xs text-slate-400 font-mono">• {currentQuote.category}</span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-100 italic leading-relaxed">
            "{currentQuote.quote}"
          </p>

          <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200/90 flex items-start gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{currentQuote.tip}</span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-emerald-400">
              — {currentQuote.author}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakQuote}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
                  isSpeaking
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                    : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                }`}
                title={isSpeaking ? "Stop Voice" : "Listen to Captain ZeroWaste speak"}
              >
                {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                {isSpeaking ? "Stop" : "Tell Me"}
              </button>

              <button
                onClick={handleNextQuote}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition"
              >
                <Shuffle className="w-3 h-3" />
                Next Quote
              </button>

              <button
                onClick={handleCopyQuote}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Copy Quote"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
