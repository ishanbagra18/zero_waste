import express from 'express';
import { isAuthenticated, isVendor } from '../middleware/AuthUser.js';
import { bookVolunteer } from '../controller/booking.controller.js';
import { getAllBookings } from '../controller/booking.controller.js';
import { updatebooking } from '../controller/booking.controller.js';



const router = express.Router();


router.get("/allbooking",isAuthenticated,getAllBookings);
router.post("/bookvolunteer/:volunteerId",isAuthenticated ,isVendor("NGO"),bookVolunteer);
router.patch("/:id/status", isAuthenticated, updatebooking);




export default router;