import express from 'express';
import { registerUser } from '../controllers/userController';

const router = express.Router();

// Route: POST /api/v1/register
router.post('/register', registerUser);

// Route: POST /api/v1/login
router.post('/login');

export default router;
