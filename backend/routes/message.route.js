import express from 'express'
import { getMessages,sendMessage } from '../controller/message.controller.js'
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();
router.post("/send/:id",isAuthenticated,sendMessage);
router.get('/get/:id',isAuthenticated,getMessages);

export default router;



