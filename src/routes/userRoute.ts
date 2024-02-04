import express from 'express';
import { loginUser, passwordChange, registerUser } from '../controllers/userController';
import { tokenverify } from '../middleware/authentication';

const router = express.Router();

// Route: POST /api/v1/register
router.post('/register', registerUser);

// Route: POST /api/v1/login
router.post('/login', loginUser);

// Route: POST /api/v1/change-password
router.post('/change-password', tokenverify, passwordChange);

export default router;
