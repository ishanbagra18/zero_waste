import mongoose from "mongoose";
import User from "./user.model.js"; 

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  blogImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  category: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    required: true,
  },

  adminName: {
    type: String,
    required: true,
  },

  adminphoto: {
    type: String,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},
{ timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
