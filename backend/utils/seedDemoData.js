/**
 * ZeroWaste Demo Accounts & Seed Script
 * Pre-populates the database with 3 verified role accounts and surplus listings
 * so recruiters and evaluators can immediately log in without registration friction.
 * 
 * Run via: node utils/seedDemoData.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { Item } from "../models/item.model.js";

dotenv.config();

const DEMO_PASSWORD = "DemoPass@123";

const demoUsers = [
  {
    name: "The Green Bakery & Cafe",
    email: "vendor.demo@zerowaste.org",
    phone: 9876543210,
    role: "vendor",
    organisation: "The Green Bakery Pvt Ltd",
    location: "C-Scheme, Jaipur, Rajasthan",
    averageRating: 4.8,
    reviewCount: 34,
    badge: "Gold",
    photo: {
      public_id: "demo_vendor_avatar",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
    },
  },
  {
    name: "Robin Hood Food Relief Shelter",
    email: "ngo.demo@zerowaste.org",
    phone: 9876543211,
    role: "NGO",
    organisation: "Robin Hood Community Kitchen",
    location: "Malviya Nagar, Jaipur, Rajasthan",
    averageRating: 4.9,
    reviewCount: 52,
    badge: "Gold",
    photo: {
      public_id: "demo_ngo_avatar",
      url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&auto=format&fit=crop&q=80",
    },
  },
  {
    name: "Arjun Verma (Delivery Fleet)",
    email: "volunteer.demo@zerowaste.org",
    phone: 9876543212,
    role: "Volunteer",
    organisation: "ZeroWaste Rapid Logistics Fleet",
    location: "Raja Park, Jaipur, Rajasthan",
    averageRating: 4.9,
    reviewCount: 28,
    badge: "Silver",
    photo: {
      public_id: "demo_volunteer_avatar",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    },
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("❌ MONGODB_URI not found in environment.");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB for seeding...");
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully.");

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    const createdUsers = {};

    for (const userData of demoUsers) {
      let user = await User.findOne({ email: userData.email });
      if (user) {
        user.name = userData.name;
        user.role = userData.role;
        user.organisation = userData.organisation;
        user.location = userData.location;
        user.password = hashedPassword;
        user.averageRating = userData.averageRating;
        await user.save();
        console.log(`🔄 Updated existing demo user: ${userData.email} (${userData.role})`);
      } else {
        user = await User.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`✨ Created new demo user: ${userData.email} (${userData.role})`);
      }
      createdUsers[userData.role] = user;
    }

    // Seed Sample Surplus Items
    const sampleItems = [
      {
        name: "Fresh Whole-Wheat Bread & Artisan Buns",
        description: "Freshly baked evening surplus from day bakery run. Packed in clean food-grade brown kraft bags.",
        quantity: 15,
        category: "Food",
        price: 0,
        mode: "donation",
        location: "C-Scheme, Jaipur",
        status: "available",
        vendor: createdUsers["vendor"]._id,
        foodType: "veg",
        weightKg: 6,
        isUrgent: false,
        expiryDate: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours remaining
        geoPoint: {
          type: "Point",
          coordinates: [75.8015, 26.9112],
        },
        itemImage: {
          public_id: "demo_bread_img",
          url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        },
      },
      {
        name: "Surplus Executive Lunch Meals (Dal Makhani & Steamed Rice)",
        description: "Untouched corporate catering surplus maintained in insulated thermal containers at >65°C.",
        quantity: 25,
        category: "Food",
        price: 0,
        mode: "donation",
        location: "Tonk Road, Jaipur",
        status: "available",
        vendor: createdUsers["vendor"]._id,
        foodType: "veg",
        weightKg: 12.5,
        isUrgent: true,
        expiryDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours remaining (⚡ Urgent)
        geoPoint: {
          type: "Point",
          coordinates: [75.7924, 26.8856],
        },
        itemImage: {
          public_id: "demo_meal_img",
          url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        },
      },
    ];

    for (const itemData of sampleItems) {
      const existing = await Item.findOne({ name: itemData.name });
      if (!existing) {
        await Item.create(itemData);
        console.log(`📦 Seeded surplus item: ${itemData.name}`);
      } else {
        existing.status = "available";
        existing.claimedBy = null;
        existing.claimStatus = null;
        await existing.save();
        console.log(`🔄 Reset surplus item to available: ${itemData.name}`);
      }
    }

    console.log("\n=======================================================");
    console.log("🎉 SEED COMPLETED SUCCESSFULLY!");
    console.log("Demo Credentials Available:");
    console.log("1. Vendor:    vendor.demo@zerowaste.org    | Password: DemoPass@123");
    console.log("2. NGO:       ngo.demo@zerowaste.org       | Password: DemoPass@123");
    console.log("3. Volunteer: volunteer.demo@zerowaste.org | Password: DemoPass@123");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
