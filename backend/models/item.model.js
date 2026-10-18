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
        enum: ["available", "claimed", "rejected", "completed", "expired"],
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

    expiryDate: {
        type: Date,
        default: null,
    },

    isUrgent: {
        type: Boolean,
        default: false,
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

    deliveryStatus: {
        type: String,
        enum: ["none", "volunteer_assigned", "pickup_confirmed", "delivered"],
        default: "none",
    },

    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },

    deliveryOtp: {
        type: String,
        default: null,
        select: false,
    },

    deliveryOtpExpiresAt: {
        type: Date,
        default: null,
    },

    pickupConfirmedAt: {
        type: Date,
        default: null,
    },

    deliveredAt: {
        type: Date,
        default: null,
    },

    claimedAt: {
        type: Date,
        default: null, // Initialize as null
    },

    rejectionHistory: [
        {
            rejectedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            rejectedByName: {
                type: String,
            },
            previousClaimedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
            rejectedAt: {
                type: Date,
                default: Date.now,
            },
            restoredAt: {
                type: Date,
                default: null,
            },
        },
    ],

    conditionReport: {
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        issueType: {
            type: String,
            enum: ["packaging_damage", "temperature_breach", "spoilage_risk", "quantity_mismatch", "other"],
            default: null,
        },
        severity: {
            type: String,
            enum: ["minor_notice", "partial_damage", "major_unsafe"],
            default: "minor_notice",
        },
        notes: {
            type: String,
            default: "",
        },
        reportedAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["logged", "reviewed", "resolved"],
            default: "logged",
        },
    },

}, { timestamps: true });

export const Item = mongoose.model("Item", itemSchema);
