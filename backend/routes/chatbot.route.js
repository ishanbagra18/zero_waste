import express from 'express';
import { isAuthenticated, isVendor } from '../middleware/AuthUser.js';
import { chatWithBot } from '../controller/chatbot.controller.js';



const router = express.Router();


router.post('/chatbot', isAuthenticated , chatWithBot);




export default router;