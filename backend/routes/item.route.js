import express from 'express';
import { claimItem, confirmPickup, createItem, deleteItem, getAllItems, getClaimedItems, getSingleItem, markItemDeliveryReached, myAllItems, updateItem, verifyDeliveryOtp } from '../controller/item.controller.js';
import { isAuthenticated, isVendor } from '../middleware/AuthUser.js';
import { updateClaimStatus } from '../controller/item.controller.js';


const router = express.Router();


router.post("/create-item",isAuthenticated ,isVendor("vendor"),createItem);
router.get("/get-items", isAuthenticated , getAllItems);
router.get("/my-items", isAuthenticated, isVendor("vendor"), myAllItems);
router.delete("/delete-item/:id", isAuthenticated, isVendor("vendor"), deleteItem);
router.get("/get-item/:id", isAuthenticated, getSingleItem);
router.put("/update-item/:id", isAuthenticated, isVendor("vendor"), updateItem); 
router.patch("/:id/claim",isAuthenticated , isVendor("NGO"),claimItem);
router.get("/get-claimed-items" , isAuthenticated , isVendor("NGO"), getClaimedItems);
router.patch("/:id/claim-status", isAuthenticated, isVendor("vendor", "NGO"), updateClaimStatus);
router.patch("/:id/delivery-reached", isAuthenticated, isVendor("Volunteer"), markItemDeliveryReached);
router.patch("/:id/pickup-confirmed", isAuthenticated, isVendor("Volunteer"), confirmPickup);
router.patch("/:id/verify-otp", isAuthenticated, isVendor("NGO"), verifyDeliveryOtp);






export default router;