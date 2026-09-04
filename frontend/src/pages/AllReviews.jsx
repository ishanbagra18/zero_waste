import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MessageSquare, ArrowLeft, RefreshCw, Clock, User } from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

const getInitials = (name = "") => {
  const cleanName = name.trim();
  if (!cleanName) return "U";
  return cleanName
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function AllReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!id) {
      setError("User identification token is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/review/${id}`);
      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.error("API Failure:", err);
      setError(err.response?.data?.message || "Failed to load review history.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      {/* Hero Header */}
      <ParallaxHero
        badgeText="Community Review Ledger"
        title={
          <>
            User Feedback & <span className="text-emerald-400">Reviews</span>
          </>
        }
        subtitle="Verified ratings, feedback logs, and partner evaluations from the ZeroWaste exchange ledger."
        actionButtons={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Return Back
          </button>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 max-w-md mx-auto space-y-3">
            <p className="text-sm font-semibold text-rose-400">{error}</p>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Retry Loading Reviews
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm italic space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <p>No review entries logged for this profile yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const reviewerName = review.reviewer?.name || "Partner Member";
              const ratingScore = review.rating ?? 0;

              return (
                <div
                  key={review._id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-sm flex items-center justify-center">
                        {getInitials(reviewerName)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{reviewerName}</h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-3.5 h-3.5 ${
                            index < ratingScore ? "fill-amber-400 text-amber-400" : "text-slate-700"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-black ml-1">{ratingScore.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{review.comment || "Verified transaction review."}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}