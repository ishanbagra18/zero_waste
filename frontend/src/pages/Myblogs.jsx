import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import api from "../util/api";

const Myblogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in first.");
        setLoading(false);
        return;
      }

      const res = await api.get("/api/blog/my-blog", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs(res.data);
    } catch (err) {
      console.error("❌ Error fetching my blogs:", err);
      if (err.response) {
        alert(err.response.data.message || "Error fetching blogs");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in first.");
        return;
      }

      await api.delete(`/api/blog/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));

      alert("✅ Blog deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting blog:", err);
      alert(err.response?.data?.message || "Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter">
        <p className="text-lg animate-pulse">Loading your blogs...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-black text-white p-8 font-inter"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 10%, rgba(128, 90, 213, 0.15), transparent 50%), radial-gradient(circle at 75% 90%, rgba(56, 189, 248, 0.15), transparent 50%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 select-none">
          My Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-gray-400 text-lg select-none">
            You haven’t posted any blogs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white bg-opacity-10 rounded-3xl backdrop-blur-md border border-purple-700 shadow-neu-glow hover:shadow-neu-glow-lg transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer"
                tabIndex={0}
                aria-label={`View and manage blog titled ${blog.title}`}
                onClick={() =>
                  window.open(`/blogsbyid/${blog._id}`, "_blank")
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    window.open(`/blogsbyid/${blog._id}`, "_blank");
                }}
                role="button"
              >
                {blog.blogImage?.url ? (
                  <img
                    src={blog.blogImage.url}
                    alt={blog.title}
                    className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500 select-none"
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-gray-400 italic text-xl font-semibold select-none">
                    No Image
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <h2
                    className="text-2xl font-extrabold mb-2 truncate"
                    title={blog.title}
                  >
                    {blog.title}
                  </h2>
                  <p className="text-indigo-300 font-semibold uppercase tracking-wide text-sm mb-3 select-none">
                    {blog.category}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-4 flex-grow select-text">
                    {blog.about}
                  </p>

                  <footer className="mt-5 flex items-center justify-between text-gray-400 text-xs select-none">
                    <time dateTime={new Date(blog.createdAt).toISOString()}>
                      Posted on{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </time>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlog(blog._id);
                      }}
                      type="button"
                      aria-label={`Delete blog titled ${blog.title}`}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg px-4 py-2 shadow-neu-button text-white font-semibold select-none focus:outline-none focus:ring-4 focus:ring-red-500 active:scale-95 transform"
                    >
                      <FiTrash2 size={18} />
                      Delete
                    </button>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .shadow-neu-glow {
          box-shadow:
            0 4px 10px rgba(138, 43, 226, 0.45),
            0 8px 30px rgba(138, 43, 226, 0.35);
        }

        .shadow-neu-glow-lg {
          box-shadow:
            0 6px 20px rgba(138, 43, 226, 0.6),
            0 12px 40px rgba(138, 43, 226, 0.5);
        }

        .shadow-neu-button {
          box-shadow:
            inset 4px 4px 8px rgba(255, 20, 147, 0.55),
            inset -4px -4px 8px rgba(75, 0, 130, 0.55);
        }
      `}</style>
    </div>
  );
};

export default Myblogs;
