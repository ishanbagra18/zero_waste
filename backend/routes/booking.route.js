import express from 'express';
import { isAuthenticated, isVendor } from '../middleware/AuthUser.js';
import {
  bookVolunteer,
  getAllBookings,
  acceptBooking,
  confirmBookingPickup,
  verifyBookingOtp
} from '../controller/booking.controller.js';

const router = express.Router();

router.get("/allbooking", isAuthenticated, getAllBookings);
router.post("/bookvolunteer/:volunteerId", isAuthenticated, isVendor("NGO"), bookVolunteer);
router.patch("/:id/accept", isAuthenticated, acceptBooking);
router.patch("/:id/pickup-confirmed", isAuthenticated, confirmBookingPickup);
router.patch("/:id/verify-otp", isAuthenticated, verifyBookingOtp);

export default router;