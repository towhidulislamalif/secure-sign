import express from 'express';
import {
  loginUser,
  passwordChange,
  passwordForget,
  passwordReset,
  registerUser,
} from '../controllers/userController';
import { tokenverify } from '../middleware/authentication';

const router = express.Router();

// Route: POST /api/v1/register
router.post('/register', registerUser);

// Route: POST /api/v1/login
router.post('/login', loginUser);

// Route: POST /api/v1/change-password
router.post('/change-password', tokenverify, passwordChange);

// Route: POST /api/v1/forget-password
router.post('/forget-password', passwordForget);

// Route: POST /api/v1/reset-password
router.post('/reset-password', passwordReset);

export default router;
