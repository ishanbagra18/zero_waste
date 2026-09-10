import express from 'express'
import { getMessages, sendMessage, deleteMessage } from '../controller/message.controller.js'
import { isAuthenticated } from '../middleware/AuthUser.js';

const router = express.Router();
router.post("/send/:id", isAuthenticated, sendMessage);
router.get('/get/:id', isAuthenticated, getMessages);
router.delete('/delete/:id', isAuthenticated, deleteMessage);

export default router;



