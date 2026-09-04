import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Star, MessageSquare, ArrowLeft, Send } from "lucide-react";
import ParallaxHero from "../components/ParallaxHero";

export default function SendReview() {
  const { id: reviewedUserId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating before submitting.");
      return;
    }
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/review/${reviewedUserId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-24">
      <Toaster position="top-right" />

      {/* Hero Header */}
      <ParallaxHero
        badgeText="Community Feedback System"
        title={
          <>
            Leave a <span className="text-emerald-400">User Review</span>
          </>
        }
        subtitle="Rate your interaction experience with this partner vendor or NGO on the ZeroWaste exchange ledger."
        actionButtons={
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Return Back
          </button>
        }
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <form
          onSubmit={handleSubmit}
          className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6"
        >
          {/* Star Selection Row */}
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Select Rating Score
            </span>
            <div className="flex justify-center items-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFilled = (hoverRating || rating) >= starIndex;
                return (
                  <Star
                    key={starIndex}
                    onMouseEnter={() => setHoverRating(starIndex)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starIndex)}
                    className={`w-9 h-9 cursor-pointer transition-all ${
                      isFilled
                        ? "text-amber-400 fill-amber-400 scale-110"
                        : "text-slate-700 hover:text-amber-300"
                    }`}
                  />
                );
              })}
            </div>
            {rating > 0 && (
              <p className="text-xs font-bold text-amber-400 pt-1">
                {rating} / 5 Stars Selected
              </p>
            )}
          </div>

          {/* Comment Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Feedback Notes / Comments
            </label>
            <textarea
              placeholder="Describe your collaboration, food quality, punctuality..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Submitting Feedback...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 text-slate-950" /> Submit Review Entry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
