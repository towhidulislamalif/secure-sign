import express from 'express';

const router = express.Router();

// Route: POST /api/v1/register
router.post('/register');

// Route: POST /api/v1/login
router.post('/login');

export default router;
