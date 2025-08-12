import React, { useState } from "react";
import axios from "axios";

const Createblog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in first.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("blogImage", blogImage);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("about", about);

      const res = await axios.post(
        "http://localhost:3002/api/blog/createblog",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Blog Created:", res.data);
      alert("Blog created successfully!");

      setTitle("");
      setCategory("");
      setAbout("");
      setBlogImage(null);
    } catch (err) {
      console.error("❌ Error creating blog:", err);
      if (err.response) {
        console.error("🔍 Server Response:", err.response.data);
        alert(err.response.data.message || "Error creating blog");
      } else {
        alert("Error creating blog");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-black text-white font-inter flex flex-col items-center justify-start py-16 px-4"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(128, 90, 213, 0.08), transparent 40%), radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.08), transparent 40%)",
      }}
    >
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 select-none text-center">
          Create a New Blog
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-black bg-opacity-90 backdrop-blur-lg rounded-3xl p-10 shadow-neu-glow border border-purple-700"
          encType="multipart/form-data"
        >
          {/* Blog Image */}
          <label className="block mb-6 cursor-pointer">
            <span className="text-gray-300 font-semibold mb-1 block select-none">
              Blog Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBlogImage(e.target.files[0])}
              className="w-full rounded-xl bg-black text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition cursor-pointer"
              required
              aria-required="true"
            />
          </label>

          {/* Title */}
          <label className="block mb-6">
            <span className="text-gray-300 font-semibold mb-1 block select-none">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-black text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition font-semibold"
              placeholder="Enter blog title"
              required
              aria-required="true"
            />
          </label>

          {/* Category */}
          <label className="block mb-6">
            <span className="text-gray-300 font-semibold mb-1 block select-none">
              Category
            </span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-black text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition font-semibold"
              placeholder="Enter blog category"
              required
              aria-required="true"
            />
          </label>

          {/* About */}
          <label className="block mb-8">
            <span className="text-gray-300 font-semibold mb-1 block select-none">
              About
            </span>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows="5"
              className="w-full p-3 rounded-xl bg-black text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition resize-none font-semibold"
              placeholder="Write about your blog..."
              required
              aria-required="true"
            ></textarea>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-700 py-4 rounded-xl font-extrabold text-white shadow-neu-button hover:shadow-neu-glow focus:outline-none focus:ring-4 focus:ring-pink-500 transition-transform active:scale-95 disabled:opacity-50 select-none"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>

      {/* Custom shadows and font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .shadow-neu-glow {
          box-shadow:
            0 4px 15px rgba(255, 20, 147, 0.6),
            0 0 30px rgba(138, 43, 226, 0.65);
        }

        .shadow-neu-button {
          box-shadow:
            4px 4px 15px rgba(255, 20, 147, 0.75),
            -4px -4px 15px rgba(138, 43, 226, 0.75);
        }
      `}</style>
    </div>
  );
};

export default Createblog;
