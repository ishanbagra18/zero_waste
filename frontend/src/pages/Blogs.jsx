import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../util/api";
import toast, { Toaster } from "react-hot-toast";
import { FiPlus, FiThumbsUp, FiUser, FiCalendar } from "react-icons/fi";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [myBlogsCount, setMyBlogsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/api/blog/getallblogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fixedBlogs = res.data.map((blog) => {
          if (typeof blog.adminphoto === "string") {
            try {
              blog.adminphoto = JSON.parse(blog.adminphoto);
            } catch {
              blog.adminphoto = null;
            }
          }
          return blog;
        });


        

        setBlogs(fixedBlogs);

        console.log(res.data);




      } catch (err) {
        console.error("❌ Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/api/blog/my-blog", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMyBlogsCount(res.data.length || 0);
      } catch (err) {
        console.error("❌ Error fetching my blogs:", err);
      }
    };

    fetchMyBlogs();
  }, []);

  useEffect(() => {
    if (location.state?.blogCreated) {
      toast.success("✅ Blog created successfully!");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div
      className="min-h-screen bg-gray-950 text-white font-inter relative overflow-x-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at 80% 90%, rgba(236, 72, 153, 0.15), transparent 40%)",
      }}
    >
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-gray-950/90 shadow-lg sticky top-0 z-50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1
            className="text-4xl font-extrabold tracking-wide text-white drop-shadow-lg cursor-pointer select-none"
            onClick={() => navigate("/")}
            aria-label="Go to homepage"
          >
            BlogSpace
          </h1>

          <div className="flex gap-6">
            <button
              onClick={() => navigate("/myblogs")}
              className="flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 transition-all rounded-xl px-6 py-2 shadow-neu focus:outline-none focus:ring-4 focus:ring-indigo-500 text-indigo-300 font-semibold transform hover:scale-105 active:scale-95"
              aria-label={`My Blogs, ${myBlogsCount} blogs`}
              type="button"
            >
              <FiUser size={20} />
              My Blogs ({myBlogsCount})
            </button>

            <button
              onClick={() => navigate("/createblog")}
              className="flex items-center gap-2 bg-gradient-to-tr from-pink-600 to-purple-700 rounded-xl px-6 py-2 font-semibold text-white transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-neu-button"
              aria-label="Create a new blog"
              type="button"
            >
              <FiPlus size={20} />
              Create Blog
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-5xl font-extrabold mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          All Blogs
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 text-xl animate-pulse mt-20">
            Loading blogs...
          </p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-20">
            No blogs found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-gray-900 border border-gray-800 rounded-3xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] active:scale-100 flex flex-col overflow-hidden"
                onClick={() => navigate(`/blogsbyid/${blog._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    navigate(`/blogsbyid/${blog._id}`);
                }}
                aria-label={`View blog titled ${blog.title}`}
              >
                {blog.blogImage?.url ? (
                  <img
                    src={blog.blogImage.url}
                    alt={blog.title}
                    className="w-full h-56 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-800 flex items-center justify-center text-gray-500 italic text-xl tracking-widest font-semibold">
                    No Image
                  </div>
                )}

                <div className="p-7 flex flex-col flex-grow justify-between gap-6">
                  <header>
                    <h3
                      className="text-3xl font-extrabold truncate text-gray-100"
                      title={blog.title}
                    >
                      {blog.title}
                    </h3>
                    <span className="inline-block mt-1 text-indigo-300 font-semibold uppercase tracking-widest text-sm bg-indigo-900/50 rounded-full px-3 py-1">
                      {blog.category}
                    </span>
                  </header>

                  <p
                    className="text-gray-300 line-clamp-5 leading-relaxed"
                    title={blog.about}
                  >
                    {blog.about}
                  </p>

                  <footer className="flex items-center justify-between text-gray-400 text-sm">
<div className="flex items-center gap-3">
  {blog.adminphoto?.url || blog.adminphoto ? (
    <img
      src={blog.adminphoto?.url || blog.adminphoto}
      alt={`${blog.adminName} avatar`}
      className="w-12 h-12 rounded-full border-2 border-indigo-400 shadow-lg"
      loading="lazy"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-indigo-400 font-bold border-2 border-indigo-400 shadow-lg">
      ?
    </div>
  )}
  <span className="font-semibold text-indigo-300 text-lg">
    {blog.adminName}
  </span>
</div>


                    <div className="flex flex-col items-end space-y-1">
                      <span className="flex items-center gap-2 font-semibold text-pink-500">
                        <FiThumbsUp />
                        {blog.likes?.length || 0}
                      </span>
                      <time
                        dateTime={new Date(blog.createdAt).toISOString()}
                        className="flex items-center gap-2 text-gray-500 font-mono text-xs"
                        title={new Date(blog.createdAt).toLocaleString()}
                      >
                        <FiCalendar />
                        {new Date(blog.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Add Google Fonts */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          .shadow-neu {
            box-shadow:
              8px 8px 15px rgba(0,0,0,0.6),
              -8px -8px 15px rgba(255,255,255,0.05);
          }
          .shadow-neu-button {
            box-shadow:
              4px 4px 8px rgba(255, 20, 147, 0.5),
              -4px -4px 8px rgba(75, 0, 130, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default Blogs;
