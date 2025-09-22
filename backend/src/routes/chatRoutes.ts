import express from 'express';
import { handleChat, getTools } from '../controllers/chatController';

const router = express.Router();
router.post('/chat', handleChat);
router.get('/tools', getTools);

export default router;
