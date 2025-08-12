import Booking from "../models/booking.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const bookVolunteer = async (req, res) => {
  try {
    console.log("⏳ Booking request received");

    const { volunteerId } = req.params; 
    console.log(volunteerId);
    const { fromLocation, toLocation, notes } = req.body;

    console.log(req.user);
    console.log(req.user.userId); // ✅ correct ID

    if (!req.user || !req.user.userId) {
      console.error("🚫 req.user is missing. Check your auth middleware.");
      return res.status(401).json({ message: "Unauthorized. User info missing." });
    }

    const ngoId = req.user.userId;

    // ✅ Debug: Logging info
    console.log("🔐 Authenticated NGO ID:", ngoId);
    console.log("📍 Booking from:", fromLocation, "to:", toLocation);
    console.log("🧑 Volunteer ID:", volunteerId);

    // Find volunteer
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Create booking
    const booking = await Booking.create({
      ngo: ngoId,
      volunteer: volunteerId,
      fromLocation,
      toLocation,
      notes,
      status: "pending",
    });

    // 🎯 Add 10 points to volunteer
    await User.findByIdAndUpdate(volunteerId, { $inc: { points: 10 } });
    console.log(`🎯 +10 points awarded to volunteer (${volunteerId})`);

    // Create notification
    await Notification.create({
      userId: volunteerId,
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `📢 New booking request from ${req.user.name} - From ${fromLocation} to ${toLocation}`,
    });

    return res.status(201).json({
      message: "✅ Volunteer booked successfully. Awaiting confirmation.",
      booking,
    });
  } catch (error) {
    console.error("❌ Error booking volunteer:", error);
    return res.status(500).json({ message: "Server error while booking volunteer." });
  }
};






export const getAllBookings = async (req, res) => {
  try {
    console.log("📥 Fetching all bookings");

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized. User info missing." });
    }

    const userId = req.user.userId;
    const role = req.user.role;
    let bookings;

    if (role === "NGO") {
      bookings = await Booking.find({ ngo: userId })
        .populate("volunteer", "name email location")
        .sort({ createdAt: -1 });
    } else if (role === "Volunteer") {
      bookings = await Booking.find({ volunteer: userId })
        .populate("ngo", "name email organisation location")
        .sort({ createdAt: -1 });
    } else {
      // Admin or other role
      bookings = await Booking.find()
        .populate("ngo", "name email organisation location")
        .populate("volunteer", "name email location")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};




export const updatebooking = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["pending", "accepted", "rejected", "cancelled", "completed"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid booking status" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("ngo volunteer");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const notificationMessage = `Booking from ${booking.fromLocation} to ${booking.toLocation} was ${status}.`;

    // 🔔 Send to Volunteer
    await Notification.create({
      userId: booking.volunteer._id,
      message: notificationMessage,
      userInfo: {
        name: booking.volunteer.name,
        email: booking.volunteer.email,
        organisation: booking.volunteer.organisation,
        location: booking.volunteer.location,
      },
    });

    // 🔔 Send to NGO
    await Notification.create({
      userId: booking.ngo._id,
      message: notificationMessage,
      userInfo: {
        name: booking.ngo.name,
        email: booking.ngo.email,
        organisation: booking.ngo.organisation,
        location: booking.ngo.location,
      },
    });

    res.status(200).json({ message: "Booking updated and notifications sent", booking });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

