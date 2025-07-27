import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

// Cloudinary config (can move to config.js file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "Please upload a file." });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed.",
      });
    }

    const { name, email, phone, organisation, location, role, password } =
      req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !organisation ||
      !location ||
      !role ||
      !password ||
      !photo
    ) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(cloudinaryResponse.error);
      return res
        .status(500)
        .json({ message: "Image upload failed. Please try again." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      organisation,
      location,
      role,
      password: hashedPassword,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    await newUser.save();

    if (newUser) {
      const token = await createTokenAndSaveCookies({
        userId: newUser._id,
        res,
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        token: token,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};





export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all fields for login" });
    }

    const user = await User.findOne({ email, role }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(404).json({ message: "Password not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(401).json({ message: "Invalid role" });
    }

    const token = await createTokenAndSaveCookies({ userId: user._id, res });

    return res.status(200).json({
      message: "User login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






export const forgotPassword = async (req, res) => {
  const { email, role, newPassword } = req.body;

  try {
    if (!email || !role || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all fields for password reset" });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};








export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Disallow password and role updates
    delete req.body.password;
    delete req.body.role;

    const allowedUpdates = ['name', 'email', 'phone', 'organisation', 'location'];
    const updates = {};

    // Filter allowed fields only
    allowedUpdates.forEach((field) => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    // Optional: handle photo update
    if (req.files && req.files.photo) {
      const photo = req.files.photo;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only JPG, PNG, and WEBP are allowed.",
        });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).json({ message: "Photo upload failed" });
      }

      updates.photo = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const myProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: "NGO" }).sort({ createdAt: -1 }).select("-password");

    return res.status(200).json({
      message: "NGOs fetched successfully.",
      ngos,
    });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




export const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).sort({ createdAt: -1 }).select("-password");

    return res.status(200).json({
      message: "Vendors fetched successfully.",
      vendors,
    });
  } catch (error) {
    console.error("Error fetching Vendors:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getAllVolunteer = async (req,res)=>
{
  try {

    const Volunteer = await User.find({role :"Volunteer"}).sort({createdAt:-1}).select("-password");

    return res.status(200).json({
      message: "Volunteer fetched successfully.",
      Volunteer,
      });
  
  } catch (error) {
        console.error("Error fetching Volunteer:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
