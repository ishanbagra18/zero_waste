import Booking from "../models/booking.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

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

    // Create notification
    await Notification.create({
      userId: volunteerId,
      bookingId: booking._id,
      notificationType: "booking_request",
      actionStatus: "pending",
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `📢 New booking request from ${req.user.name} (NGO ID: ${ngoId}) - From ${fromLocation} to ${toLocation}`,
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


export const acceptBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { ngoId } = req.body;

    if (!bookingId || !ngoId) {
      return res.status(400).json({ message: "Booking ID and NGO ID are required." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.volunteer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Only the assigned volunteer can accept the booking request." });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: `Booking status is already '${booking.status}'.` });
    }

    if (booking.ngo.toString() !== ngoId.trim()) {
      return res.status(400).json({ message: "Invalid NGO ID. Please enter the correct NGO ID from the notification." });
    }

    booking.status = "accepted";
    await booking.save();

    await Notification.updateMany(
      {
        bookingId: booking._id,
        notificationType: "booking_request",
        userId: req.user.userId,
      },
      {
        $set: {
          actionStatus: "approved",
          isRead: true,
        },
      }
    );

    await Notification.create({
      userId: booking.ngo,
      bookingId: booking._id,
      notificationType: "booking_accepted",
      actionStatus: "approved",
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `✅ Volunteer ${req.user.name} has accepted your booking request for transport.`,
    });

    return res.status(200).json({
      message: "Booking request accepted successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Error accepting booking request:", error);
    return res.status(500).json({ message: "Server error while accepting booking." });
  }
};


export const confirmBookingPickup = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { ngoId } = req.body;

    if (!bookingId || !ngoId) {
      return res.status(400).json({ message: "Booking ID and NGO ID are required." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.volunteer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Only the assigned volunteer can confirm pickup." });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({ message: "Booking must be accepted before pickup can be confirmed." });
    }

    if (booking.ngo.toString() !== ngoId.trim()) {
      return res.status(400).json({ message: "Invalid NGO ID. Transport confirmation failed." });
    }

    const otp = generateOtp();
    booking.status = "pickup_confirmed";
    booking.pickupConfirmedAt = new Date();
    booking.deliveryOtp = otp;
    booking.deliveryOtpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await booking.save();

    // Notify NGO (only NGO gets the OTP code)
    await Notification.create({
      userId: booking.ngo,
      bookingId: booking._id,
      notificationType: "booking_pickup_confirmed",
      actionStatus: "pending",
      otpCode: otp,
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `Pickup confirmed for booking ${booking._id}. Give OTP ${otp} to the volunteer to verify delivery.`,
    });

    // Notify Volunteer (without OTP code)
    await Notification.create({
      userId: booking.volunteer,
      bookingId: booking._id,
      notificationType: "booking_pickup_confirmed",
      actionStatus: "pending",
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `Pickup confirmed for booking ${booking._id}. Ask the NGO for the OTP when you arrive to verify delivery.`,
    });

    return res.status(200).json({
      message: "Pickup confirmed successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Error confirming booking pickup:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const verifyBookingOtp = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { otp } = req.body;

    if (!bookingId || !otp) {
      return res.status(400).json({ message: "Booking ID and OTP are required." });
    }

    const booking = await Booking.findById(bookingId).select("+deliveryOtp");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Allow either NGO or Volunteer to verify OTP
    const isNgo = booking.ngo.toString() === req.user.userId.toString();
    const isVolunteer = booking.volunteer.toString() === req.user.userId.toString();
    if (!isNgo && !isVolunteer) {
      return res.status(403).json({ message: "Only the booking NGO or the assigned volunteer can verify the OTP." });
    }

    if (booking.status !== "pickup_confirmed") {
      return res.status(400).json({ message: "Pickup must be confirmed before OTP verification." });
    }

    if (booking.deliveryOtpExpiresAt && booking.deliveryOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    if (String(booking.deliveryOtp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    booking.status = "delivered";
    booking.deliveredAt = new Date();
    booking.deliveryOtp = null;
    booking.deliveryOtpExpiresAt = null;
    await booking.save();

    // Mark previous notifications as reading/action completed
    await Notification.updateMany(
      {
        bookingId: booking._id,
        notificationType: "booking_pickup_confirmed",
      },
      {
        $set: {
          actionStatus: "collected",
          isRead: true,
        },
      }
    );

    // Notify Volunteer
    await Notification.create({
      userId: booking.volunteer,
      bookingId: booking._id,
      notificationType: "booking_delivered",
      actionStatus: "info",
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `Booking ${booking._id} delivery has been verified by OTP and completed.`,
    });

    // Notify NGO
    await Notification.create({
      userId: booking.ngo,
      bookingId: booking._id,
      notificationType: "booking_delivered",
      actionStatus: "info",
      userInfo: {
        name: req.user.name,
        email: req.user.email,
        organisation: req.user.organisation,
        location: req.user.location,
      },
      message: `Booking ${booking._id} delivery has been verified by OTP and completed.`,
    });

    return res.status(200).json({
      message: "OTP verified successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Error verifying booking OTP:", error);
    return res.status(500).json({ message: "Server error" });
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
