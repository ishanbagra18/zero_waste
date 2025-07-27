import mongoose from "mongoose";
import User from "../models/user.model.js";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        enum: ["Food", "Textile", "Books", "Other"],
        required: true,
    },

    price: {
        type: Number,
        required: true,
        default: 0,
    },

    mode: {
        type: String,
        enum: ["donation", "sale"],
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["available", "claimed", "completed", "expired"],
        default: "available",
        required: true,
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    itemImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    // New fields for claims
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO", // Reference to the NGO model
        default: null, // Initialize as null
    },

    claimStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "collected"],
        default: null, // Initialize as null
    },

    claimedAt: {
        type: Date,
        default: null, // Initialize as null
    },

}, { timestamps: true });

export const Item = mongoose.model("Item", itemSchema);
