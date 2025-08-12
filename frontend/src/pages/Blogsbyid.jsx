import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../util/api";
import { FiThumbsUp, FiSend, FiMessageSquare } from "react-icons/fi";

const Blogsbyid = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Show only 2 comments initially

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found. User might not be logged in.");
          return;
        }

        const res = await api.get(`/api/blog/single-blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let fixedBlog = res.data;
        if (typeof fixedBlog.adminphoto === "string") {
          try {
            fixedBlog.adminphoto = JSON.parse(fixedBlog.adminphoto);
          } catch {
            fixedBlog.adminphoto = null;
          }
        }

        setBlog(fixedBlog);
        setLikesCount(fixedBlog.likes?.length || 0);
        setComments(fixedBlog.comments || []);
      } catch (err) {
        console.error("❌ Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in to like posts");

      const res = await api.post(`/api/blog/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err) {
      console.error("❌ Error liking blog:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in to comment");

      const res = await api.post(`/api/blog/comment/${id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [...prev, res.data.comment]);
      setCommentText("");
      setVisibleCount((prev) => prev + 1); // show new comment immediately
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    }
  };

  if (loading)
    return (
      <p className="text-white text-center mt-40 text-xl animate-pulse">Loading blog...</p>
    );
  if (!blog)
    return <p className="text-white text-center mt-40 text-xl">Blog not found.</p>;

  return (
    <div
      className="min-h-screen w-full bg-black text-white font-inter"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.08), transparent 50%), radial-gradient(circle at 80% 90%, rgba(236, 72, 153, 0.08), transparent 50%)",
      }}
    >
      <div className="p-8 max-w-7xl mx-auto">
        {/* Blog Image */}
        {blog.blogImage?.url && (
          <img
            src={blog.blogImage.url}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-xl mb-8 select-none shadow-[0_0_25px_rgba(236,72,153,0.3)]"
            loading="lazy"
            draggable={false}
          />
        )}

        {/* Title & Category */}
        <h1
          className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
          title={blog.title}
        >
          {blog.title}
        </h1>
        <span className="inline-block text-indigo-300 font-semibold uppercase tracking-wide text-sm mb-8 bg-indigo-900/30 rounded-full px-4 py-1 select-none border border-indigo-700/50">
          {blog.category}
        </span>

        {/* Content */}
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-10">
          {blog.about}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-12 select-none">
          {blog.adminphoto?.url ? (
            <img
              src={blog.adminphoto.url}
              alt={`${blog.adminName}'s avatar`}
              className="w-14 h-14 rounded-full border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-pink-400 font-bold border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-default">
              ?
            </div>
          )}
          <div>
            <p className="text-pink-400 font-semibold text-lg">{blog.adminName}</p>
            <time
              dateTime={new Date(blog.createdAt).toISOString()}
              className="text-gray-500 font-mono text-sm"
              title={new Date(blog.createdAt).toLocaleString()}
            >
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        {/* Like Button */}
        <div className="flex items-center gap-5 mb-12">
          <button
            onClick={handleLike}
            aria-pressed={liked}
            type="button"
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-transform
              ${liked
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "bg-black hover:bg-gray-900 shadow-md"} 
              active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400`}
          >
            <FiThumbsUp size={22} />
            {liked ? "Liked" : "Like"}
            <span className="ml-2 text-lg font-bold">{likesCount}</span>
          </button>
        </div>

        {/* Comments */}
        <section>
          <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 flex items-center gap-3">
            <FiMessageSquare /> Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="flex gap-4 mb-10">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-5 py-3 rounded-full bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-tr from-pink-600 to-purple-700 px-7 rounded-full text-white font-semibold shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-500 flex items-center gap-2"
            >
              Post <FiSend size={20} />
            </button>
          </form>

          {/* Display Comments */}
          <div className="flex flex-col gap-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {comments.length > 0 ? (
              <>
                {comments.slice(0, visibleCount).map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-purple-700 bg-black"
                  >
                    <p className="text-gray-300 whitespace-pre-wrap">{c.text}</p>
                    <time
                      className="block text-xs text-gray-500 mt-2 font-mono"
                      title={new Date(c.createdAt).toLocaleString()}
                      dateTime={new Date(c.createdAt).toISOString()}
                    >
                      {new Date(c.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))}

                {visibleCount < comments.length && (
                  <button
                    onClick={() => setVisibleCount(visibleCount + 2)}
                    className="mt-4 px-4 py-2 rounded-full bg-gradient-to-tr from-pink-600 to-purple-700 text-white font-semibold shadow hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-500"
                  >
                    Load More
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-500 font-semibold text-center">
                No comments yet.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(236, 72, 153, 0.4);
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default Blogsbyid;
