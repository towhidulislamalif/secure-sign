import express from 'express';
import { loginUser, registerUser } from '../controllers/userController';

const router = express.Router();

// Route: POST /api/v1/register
router.post('/register', registerUser);

// Route: POST /api/v1/login
router.post('/login', loginUser);

export default router;
