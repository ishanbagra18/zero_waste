import express from 'express';
import { claimItem, createItem, deleteItem, getAllItems, getClaimedItems, getSingleItem, myAllItems, updateItem } from '../controller/item.controller.js';
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
router.patch("/:id/claim-status", isAuthenticated, isVendor("vendor"), updateClaimStatus);






export default router;