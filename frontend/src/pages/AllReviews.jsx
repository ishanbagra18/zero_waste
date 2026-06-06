// src/pages/AllReviews.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MdStar, MdStarBorder, MdMessage, MdErrorOutline, MdArrowBack, MdRefresh } from 'react-icons/md';

// Pure pure functional utility to map target string initial indicators
const getInitials = (name = '') => {
  const cleanName = name.trim();
  if (!cleanName) return 'A';
  return cleanName
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export default function AllReviews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracted to a stable callback reference to support retry triggers
  const fetchReviews = useCallback(async () => {
    if (!id) {
      setError('User identification token is missing from destination route.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:3002/api/review/${id}`);
      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.error('API Handshake Failure:', err);
      setError(err.response?.data?.message || 'Failed to sync with review logs directory.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white font-sans antialiased selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Component Navigation Header Bar */}
        <header className="space-y-4 border-b border-white/[0.06] pb-6">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <MdArrowBack className="text-sm group-hover:-translate-x-0.5 transition-transform" />
            Back to profile
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                User Feedback Ledger
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-400">
                Verified logs of historical ecosystem engagement ratings and evaluations.
              </p>
            </div>
            {!loading && !error && reviews.length > 0 && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-center">
                <span className="text-xs font-medium text-slate-400">Total Entries: </span>
                <span className="text-sm font-bold text-indigo-400">{reviews.length}</span>
              </div>
            )}
          </div>
        </header>

        {/* Master Render Pipeline Switchboard */}
        <main>
          {loading ? (
            <div className="space-y-4" aria-busy="true" aria-live="polite">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-900/40 p-6 rounded-2xl border border-white/[0.05] space-y-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-11 w-11 rounded-full bg-slate-800" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-800 rounded" />
                        <div className="h-3 w-24 bg-slate-800 rounded" />
                      </div>
                    </div>
                    <div className="h-7 w-14 bg-slate-800 rounded-full" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3.5 bg-slate-800 rounded w-full" />
                    <div className="h-3.5 bg-slate-800 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4 bg-red-500/[0.02] border border-red-500/20 rounded-2xl space-y-4 max-w-xl mx-auto">
              <MdErrorOutline className="mx-auto h-12 w-12 text-red-400" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-200">Data Synchronisation Fault</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={fetchReviews}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold transition duration-150"
              >
                <MdRefresh className="text-sm" /> Force Sync Retry
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/20 border border-white/[0.04] rounded-2xl space-y-3 max-w-md mx-auto">
              <MdMessage className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-300">No Review Footprint</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This node hasn't received public evaluations or tier endorsements on the ledger yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewerName = review.reviewer?.name || 'Anonymous Partner';
                const ratingScore = review.rating ?? 0;
                
                return (
                  <article 
                    key={review._id} 
                    className="group bg-white/[0.01] hover:bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05] hover:border-white/20 transition-all duration-200 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      {/* Identity Column */}
                      <div className="flex items-center space-x-3.5">
                        <div className="flex-shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-extrabold text-sm shadow-md">
                          {getInitials(reviewerName)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-100 tracking-wide group-hover:text-indigo-400 transition-colors">
                            {reviewerName}
                          </h3>
                          <time 
                            dateTime={review.createdAt}
                            className="text-xs font-medium text-slate-500 block mt-0.5"
                          >
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                      </div>

                      {/* Explicit Interactive Stars Block */}
                      <div 
                        className="flex items-center gap-0.5 self-start px-2.5 py-1 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-amber-400"
                        aria-label={`Rated ${ratingScore} out of 5 stars`}
                      >
                        <div className="flex text-sm mr-1.5" aria-hidden="true">
                          {[...Array(5)].map((_, index) => {
                            const starLevel = index + 1;
                            return starLevel <= ratingScore ? (
                              <MdStar key={index} className="shrink-0" />
                            ) : (
                              <MdStarBorder key={index} className="text-amber-500/30 shrink-0" />
                            );
                          })}
                        </div>
                        <span className="font-extrabold text-xs tracking-wider">
                          {ratingScore.toFixed(1)}
                        </span>
                      </div>

                    </div>

                    {/* Review Body Comment Payload */}
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-wrap pl-[1px]">
                      {review.comment || <span className="italic text-slate-600">Verification complete without added written notes.</span>}
                    </p>

                  </article>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}