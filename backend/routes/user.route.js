import express from 'express';
import { forgotPassword, login, logout, register, updateProfile } from '../controller/user.controller.js';
import { myProfile } from '../controller/user.controller.js';
import { getAllNGOs } from '../controller/user.controller.js';
import { getAllVendors } from '../controller/user.controller.js';
import { getAllVolunteer } from '../controller/user.controller.js';


const router = express.Router();

router.post("/register" , register );
router.post("/login" , login);
router.patch("/forgot-password",forgotPassword);
router.get("/logout",logout);
router.put("/updateProfile/:id",updateProfile);
router.get("/myprofile/:id",myProfile);
router.get("/allngo",getAllNGOs);
router.get("/allvendor",getAllVendors);
router.get("/allvolunteer",getAllVolunteer);



export default router;