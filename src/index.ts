import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: config.origin || '*', credentials: true }));
app.use(cookieParser());

// Default route for application loading
app.get('/', (_, res) => {
  res.status(200).json({
    success: true,
    message: '✨ Application successfully loaded!',
  });
});

// API routes

// Using the global error handler middleware for handling errors globally

export default app;
