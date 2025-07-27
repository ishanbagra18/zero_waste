import express from 'express';
import { isAuthenticated, isVendor } from '../middleware/AuthUser.js';
import { deleteNotification, getNotifications, markAsRead } from '../controller/notification.controller.js';

const router = express.Router();


router.get('/notification', isAuthenticated , getNotifications);
router.patch('/notification/:id/read', isAuthenticated , markAsRead);
router.delete('/notification/:id' , isAuthenticated , deleteNotification);





export default router;