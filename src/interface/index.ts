/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  date_of_birth: string;
  gender: 'male' | 'female';
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
