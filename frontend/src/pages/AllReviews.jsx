import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// A simple utility to get initials from a name, kept in the same file for consolidation.
const getInitials = (name = '') => {
  if (!name) return 'A'; // Return a default for anonymous or missing names
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
};

const AllReviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:3002/api/review/${id}`);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    } else {
      setLoading(false);
      setError('User ID is missing from the URL.');
    }
  }, [id]);

  const renderContent = () => {
    // --- Loading State with Skeleton UI ---
    if (loading) {
      return (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-slate-700"></div>
                  <div>
                    <div className="h-4 w-32 bg-slate-700 rounded"></div>
                    <div className="h-3 w-24 bg-slate-700 rounded mt-2"></div>
                  </div>
                </div>
                <div className="h-8 w-16 bg-slate-700 rounded-full"></div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-3 bg-slate-700 rounded"></div>
                <div className="h-3 bg-slate-700 rounded"></div>
                <div className="h-3 w-3/4 bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // --- Error State ---
    if (error) {
      return (
        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-red-500/30">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-200">Something went wrong</h3>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
        </div>
      );
    }
    
    // --- Empty State ---
    if (reviews.length === 0) {
      return (
        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700">
           <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-200">No Reviews Found</h3>
          <p className="mt-1 text-sm text-gray-400">You haven't received any reviews yet. Once you do, they'll show up here.</p>
        </div>
      );
    }

    // --- Success State with Review Cards ---
    return (
      <div className="space-y-6">
        {reviews.map((review) => {
          const reviewerName = review.reviewer?.name || 'Anonymous';
          const initials = getInitials(reviewerName);

          return (
            <article key={review._id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-lg">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{reviewerName}</h3>
                    <p className="text-sm text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                  <span className="text-lg">★</span>
                  <span className="font-bold text-md">{review.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="mt-5 text-slate-300 leading-relaxed">
                {review.comment}
              </p>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            My Reviews
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            A collection of all feedback and ratings you have received.
          </p>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AllReviews;