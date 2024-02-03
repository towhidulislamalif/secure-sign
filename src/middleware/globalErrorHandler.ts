/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorRequestHandler } from 'express';
import config from '../config';
import { APIError } from '../utils/ApiError';

export const globalErrorHandler: ErrorRequestHandler = (error, _, res, next) => {
  let status = error.status || 500;
  let message = error.message || 'Internal Server Error';

  if (error instanceof APIError) {
    status = error.status;
    message = error.message;
  }

  res.status(status).json({
    success: false,
    code: status,
    message,
    stack: config.node_env === 'DEVELOPMENT' ? error.stack : '',
  });
};
