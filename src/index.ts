import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import { globalErrorHandler } from './middleware/globalErrorHandler';

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

// Import routes
import userRoute from './routes/userRoute';

// API routes
app.use('/api/v1', userRoute);

// Global error handler middleware
app.use(globalErrorHandler);

export default app;
