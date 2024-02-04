/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { APIError } from '../utils/ApiError';
import { asyncRequestHandler } from '../utils/asyncRequestHandler';
import config from '../config';
import { User } from '../models/userModel';

export const tokenverify = asyncRequestHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new APIError(401, 'No authentication token provided');
    }

    try {
      const decoded = jwt.verify(token, config.access_token_secret as string) as JwtPayload;

      const user = await User.findOne({ _id: decoded._id });
      // console.log('🚀 ~ user:', user);

      if (!user) {
        throw new APIError(401, 'Invalid access token');
      }

      req.user = decoded as JwtPayload;

      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      throw new APIError(401, 'Invalid access token');
    }
  },
);
