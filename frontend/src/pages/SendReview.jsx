// SendReview.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';


// Star component for the rating system
const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
      filled ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M10 14.248l-5.292 2.782.992-5.83-4.25-4.148 5.854-.85L10 1l2.7 5.202 5.853.85-4.25 4.148.992 5.83L10 14.248z"
    />
  </svg>
);

const SendReview = () => {
  const { id: reviewedUserId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating before submitting.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://zero-waste-2xxf.onrender.com/api/review/${reviewedUserId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted successfully!");
      navigate(-1); // Go back to the previous page after submission
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
      toast.error()("Failed to submit review. " + (err.response?.data?.message || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 shadow-2xl rounded-2xl border border-gray-700"
          noValidate
        >
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Leave a Review
          </h2>
          <p className="text-gray-400 mb-6 text-center">
            How was your experience?
          </p>

          {/* Star Rating Input */}
          <div className="flex justify-center items-center mb-6 space-x-2">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Star
                key={starIndex}
                filled={(hoverRating || rating) >= starIndex}
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starIndex)}
              />
            ))}
          </div>

          {/* Comment Textarea */}
          <div className="mb-6">
            <label htmlFor="comment" className="sr-only">
              Your Review
            </label>
            <textarea
              id="comment"
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 p-4 bg-gray-900 text-gray-200 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendReview;
