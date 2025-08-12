import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

// ------------------------- CREATE BLOG -------------------------
export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog image is required." });
    }

    const { blogImage } = req.files;
    const allowedFormat = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormat.includes(blogImage.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only JPG, PNG, and WEBP formats are allowed." });
    }

    const { title, category, about } = req.body;

    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "Please fill in all blog details" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(cloudinaryResponse.error);
      return res
        .status(500)
        .json({ message: "Failed to upload blog image." });
    }

    const adminName = req?.user?.name;
    const adminphoto = req?.user?.photo; // ✅ renamed to match schema
    const createdBy = req?.user?._id;

    const blogData = {
      title,
      about,
      category,
      adminName,
      adminphoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    };

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      message: "Blog created successfully.",
      blog,
    });
  } catch (error) {
    console.log("Blog creation error", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the blog" });
  }
};

// ------------------------- DELETE BLOG -------------------------
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------- GET ALL BLOGS -------------------------
export const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    res.status(200).json(allBlogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// ------------------------- GET SINGLE BLOG -------------------------
export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id).populate("comments.user", "name photo");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};








export const getMyBlogs = async (req, res) => {
  try {
    // 1. Safely get the user ID from the request object.
    // The user ID from an auth middleware is often `req.user._id` (especially with MongoDB).
    // Optional chaining `?.` prevents an error if `req.user` doesn't exist.
    const userId = req.user.userId;

    // 2. Validate that the user ID was found.
    if (!userId) {
      console.warn("❌ Authentication error: User ID not found in `req.user`.");
      // Check your terminal for this log to see what `req.user` actually contains!
      console.log("Contents of `req.user`:", req.user);
      return res.status(401).json({ message: "User not authenticated or ID is missing." });
    }

    // 3. Fetch blogs where the 'createdBy' field matches the user's ID.
    // IMPORTANT: Make sure the field name 'createdBy' matches your Blog Model Schema exactly.
    // If your schema uses `author` or `user_id`, you must change it here.
    const myBlogs = await Blog.find({ createdBy: userId }).lean();

    console.log(`✅ Found ${myBlogs.length} blogs for user ${userId}`);

    // 4. Send the response.
    // This will correctly send an empty array [] if the user has no blogs, which is not an error.
    return res.status(200).json(myBlogs);

  } catch (error) {
    console.error("❌ Error fetching user blogs:", error);
    return res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
};







// ------------------------- TOGGLE LIKE -------------------------
export const toggleLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Only add like if user hasn't liked yet
    if (!blog.likes.includes(userId)) {
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({
        message: "Blog liked",
        likesCount: blog.likes.length,
        liked: true,
      });
    }

    // If already liked, do nothing
    return res.status(200).json({
      message: "Already liked",
      likesCount: blog.likes.length,
      liked: true,
    });

  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};







// ------------------------- ADD COMMENT -------------------------
export const addCommentToBlog = async (req, res) => {
  try {
    const { id: blogId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = {
      user: req.user.userId, // ✅ correct this line
      text,
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(200).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

