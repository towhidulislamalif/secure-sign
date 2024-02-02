import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

export const sendApiResponse = <T>(res: Response, options: Partial<ApiResponse<T>>) => {
  const { success = true, status = 200, message, data } = options;

  res.status(status).json({ success, status, message, data });
};
