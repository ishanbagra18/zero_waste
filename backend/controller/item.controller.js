import { Item } from "../models/item.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});





export const createItem = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "Item image is required." });
    }

    const { itemImage } = req.files;

    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedFormats.includes(itemImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid image format. Only JPG, PNG, and WEBP are allowed.",
      });
    }

    const { name, description, quantity, category, price, mode, location, status } = req.body;

    if (!name || !description || !quantity || !category || !price || !mode || !location || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(itemImage.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(cloudinaryResponse.error);
      return res.status(500).json({ message: "Image upload failed. Please try again." });
    }

    const newItem = new Item({
      name,
      description,
      quantity,
      category,
      price,
      mode,
      location,
      status,
      vendor: req.user.userId,
      itemImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
      claimedBy: null, // Initialize as null
      claimStatus: null, // Initialize as null
      claimedAt: null, // Initialize as null
    });

    await newItem.save();

    return res.status(201).json({
      message: "Item created successfully.",
      item: newItem,
    });

  } catch (error) {
    console.error("Error creating item:", error);
    return res.status(500).json({ message: "Server error" });
  }
};







export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find() // no status filter here
      .sort({ createdAt: -1 }) // Latest first
      .populate("vendor", "name email organisation location");

    return res.status(200).json({
      message: "Items fetched successfully",
      items,
    });
  } catch (error) {
    console.error("Get all items error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};





export const myAllItems = async (req, res) => {
  try {
    const items = await Item.find({ vendor: req.user.userId })
      .sort({ createdAt: -1 }) // Latest first
      .populate("vendor", "name email organisation location");

    return res.status(200).json({
      message: "Your items fetched successfully",
      items,
    });
  } catch (error) {
    console.error("Get my items error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully." });
    
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






export const getSingleItem = async (req, res) => {  
  try {
    const itemId = req.params.id;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required." });
    }
    const item = await Item.findById(itemId).populate("vendor", "name email organisation location");
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    return res.status(200).json({
      message: "Item fetched successfully.",
      item,
    });
  } catch (error) {
    console.error("Error fetching single item:", error);
    return res.status(500).json({ message: "Server error" });
  }
};








export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Item ID is required." });
    }

    // Prevent updates to these fields
    delete req.body.claimedBy;
    delete req.body.claimStatus;
    delete req.body.claimedAt;

    // Only allow certain fields to be updated
    const allowedFields = [
      "name",
      "description",
      "price",
      "quantity",
      "location",
      "category",
      "status",
      "mode",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    // Check and handle image upload
    if (req.files && req.files.itemImage) {
      const file = req.files.itemImage;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

      if (!allowedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid image format. Only JPG, PNG, and WEBP are allowed.",
        });
      }

      // Get existing item to delete previous image
      const existingItem = await Item.findById(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Item not found." });
      }

      // Delete old image from Cloudinary
      if (existingItem.itemImage?.public_id) {
        await cloudinary.uploader.destroy(existingItem.itemImage.public_id);
      }

      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "items",
      });

      if (!uploadResult || uploadResult.error) {
        return res.status(500).json({ message: "Image upload failed." });
      }

      updates.itemImage = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found." });
    }

    return res.status(200).json({
      message: "Item updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
























export const getClaimedItems = async (req, res) => {
  try {
    const ngoId = req.user.userId;

    if (!ngoId) {
      return res.status(400).json({ message: "NGO ID is required." });
    }

    const claimedItems = await Item.find({ claimedBy: ngoId })
      .populate("vendor", "name email organisation location photo") 
      .select("name quantity claimStatus claimedAt itemImage"); 

    if (!claimedItems || claimedItems.length === 0) {
      return res.status(404).json({ message: "No claimed items found." });
    }


        if ( claimedItems.length === 0) {
      return res.status(201).json({ message: "not claimed yet." });
    }




    return res.status(200).json({
      message: "Claimed items fetched successfully.",
      claimedItems,
    });
  } catch (error) {
    console.error("Error fetching claimed items:", error);
    return res.status(500).json({ message: "Server error" });
  }
};









  export const claimItem = async (req, res) => {
    try {
      const itemID = req.params.id;

      if (!itemID) {
        console.log("❌ Item ID is missing in request");
        return res.status(400).json({ message: "Item ID is required." });
      }

      // Populate vendor to get _id and contact info
      const item = await Item.findById(itemID).populate("vendor", "_id name email location");

      if (!item) {
        console.log(`❌ Item not found for ID: ${itemID}`);
        return res.status(404).json({ message: "Item not found." });
      }

      if (item.status === "claimed" || item.claimedBy) {
        console.log("⚠️ Item is already claimed or unavailable");
        return res.status(400).json({ message: "Item is not available for claiming." });
      }

      if (!item.vendor || !item.vendor._id) {
        console.log("❌ Vendor info is missing in item:", item);
        return res.status(500).json({ message: "Vendor information is missing in item data." });
      }

      // Update item claim details
      item.claimedBy = req.user.userId;
      item.claimStatus = "pending";
      item.claimedAt = new Date();
      item.status = "claimed";

      await item.save();
      console.log(`✅ Item "${item.name}" claimed by ${req.user.name}`);

      // Create notification for vendor
      const newNotification = await Notification.create({
        userId: item.vendor._id,
        itemId: item._id, // ✅ include item ID here
        userInfo: {
          name: req.user.name,
          email: req.user.email,
          organisation: req.user.organisation,
          location: req.user.location,
        },
        message: `Your item "${item.name}" has been claimed by ${req.user.name}.`,
      });

      console.log(`📨 Notification sent to vendor (userId: ${item.vendor._id})`);

      return res.status(200).json({
        message: "Item claimed successfully.",
        item,
        notification: newNotification,
      });

    } catch (error) {
      console.error("💥 Error in claimItem:", error);
      return res.status(500).json({ message: "Server error while claiming item." });
    }
  };








  export const updateClaimStatus = async (req, res) => {
    try {
      console.log("\n\n==========================");
      console.log("🔧 [DEBUG] Entered updateClaimStatus controller");

      const itemId = req.params.id;
      const { status } = req.body;

      console.log("🆔 Item ID:", itemId);
      console.log("📦 Requested status:", status);
      console.log("👤 Authenticated user from token:", req.user);

      const validStatuses = ["approved", "rejected", "collected"];
      if (!itemId || !status || !validStatuses.includes(status)) {
        console.warn("❌ Invalid request parameters");
        return res.status(400).json({ message: "Invalid request parameters." });
      }

      const item = await Item.findById(itemId);
      if (!item) {
        console.warn(`❌ Item not found with ID: ${itemId}`);
        return res.status(404).json({ message: "Item not found." });
      }

      console.log("✅ Item found:", item.name);
      console.log("📎 item.vendor:", item.vendor.toString());
      console.log("📎 req.user.userId:", req.user.userId);

      if (item.vendor.toString() !== req.user.userId.toString()) {
        console.warn("🚫 Unauthorized: This user is not the item's vendor");
        return res.status(403).json({ message: "You are not authorized to update this claim." });
      }

      if (!item.claimedBy) {
        console.warn("⚠️ Item is not yet claimed");
        return res.status(400).json({ message: "This item has not been claimed." });
      }

      if (item.claimStatus === status) {
        console.info(`ℹ️ Item already marked as '${status}'`);
        return res.status(400).json({ message: `Item is already marked as ${status}.` });
      }

      console.log(`✏️ Updating item claimStatus from '${item.claimStatus}' to '${status}'`);
      item.claimStatus = status;

      if (status === "rejected") {
        item.status = "available";
        console.log("🔁 Item marked back to available");
      } else if (status === "collected") {
        item.status = "completed";
        console.log("✅ Item marked as completed");
      }

      await item.save();
      console.log("💾 Item updated and saved to DB");

      await Notification.create({
        userId: item.claimedBy.toString(),
          itemId: item._id, // ✅ required
        userInfo: {
          name: req.user.name,
          email: req.user.email,
          organisation: req.user.organisation,
          location: req.user.location,
        },
        message: `Your claim for item "${item.name}" has been ${status}.`,
      });

      console.log(`📣 Notification sent to NGO (userId: ${item.claimedBy})`);
      console.log("==========================\n");

      return res.status(200).json({
        message: `Claim status updated to ${status} successfully.`,
        item,
      });

    } catch (error) {
      console.error("🔥 Error updating claim status:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };


