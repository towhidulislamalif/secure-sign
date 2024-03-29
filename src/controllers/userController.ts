import bcrypt from 'bcrypt';
import config from '../config';
import { User } from '../models/userModel';
import { APIError } from '../utils/ApiError';
import { asyncRequestHandler } from '../utils/asyncRequestHandler';
import { sendApiResponse } from '../utils/sendApiResponse';
import { sendEmail } from '../utils/sendEmail';
import { verifytoken } from '../utils/verifyToken';

export const registerUser = asyncRequestHandler(async (req, res) => {
  const userData = req.body;

  const { first_name, last_name, email, password, date_of_birth, gender } = userData;

  if (!first_name || !last_name || !email || !password || !date_of_birth || !gender) {
    throw new APIError(400, 'All fields are required');
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new APIError(409, 'User already registered');
  }

  const createdUser = await User.create({
    first_name,
    last_name,
    email,
    password,
    date_of_birth,
    gender,
  });
  const new_user = await User.findById(createdUser._id).select('-password');

  sendApiResponse(res, {
    success: true,
    status: 201,
    message: 'User registration successful',
    data: new_user,
  });
});

export const loginUser = asyncRequestHandler(async (req, res) => {
  const userData = req.body;

  const { email, password } = userData;

  if (!email || !password) {
    throw new APIError(400, 'All fields are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  const checkPassword = await user.comparePassword(password);

  if (!checkPassword) {
    throw new APIError(400, 'Password incorrect');
  }

  const access_token = user.generateAccessToken();
  const refresh_token = user.generateRefreshToken();

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: config.node_env === 'PRODUCTION',
  });

  sendApiResponse(res, {
    success: true,
    status: 200,
    message: 'User login successful',
    data: { access_token },
  });
});

export const passwordChange = asyncRequestHandler(async (req, res) => {
  const userData = req.body;
  const { _id } = req.user;

  const { old_password, new_password } = userData;

  if (!old_password || !new_password) {
    throw new APIError(400, 'All fields are required');
  }

  const user = await User.findOne({ _id });

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  const checkPassword = await user.comparePassword(old_password);

  if (!checkPassword) {
    throw new APIError(400, 'Old password is incorrect');
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(new_password)) {
    throw new APIError(
      400,
      'New password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit.',
    );
  }

  // password hashing
  const new_hashed_password = await bcrypt.hash(new_password, 10);

  await User.findOneAndUpdate(
    { _id },
    {
      $set: {
        password: new_hashed_password,
      },
    },
  );

  sendApiResponse(res, {
    success: true,
    status: 200,
    message: 'Password updated successfully',
    data: null,
  });
});

export const passwordForget = asyncRequestHandler(async (req, res) => {
  const userData = req.body;

  const { email } = userData;

  if (!email) {
    throw new APIError(400, 'Email missing');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  const access_token = user.generateAccessToken();

  const generateLink = `${config.uiLink}?_id=${user._id}&token=${access_token}`;

  // console.log('🚀 ~ passwordForget ~ generateLink:', generateLink);
  sendEmail(email, generateLink);

  sendApiResponse(res, {
    success: true,
    status: 200,
    message: 'Sent email successfully',
    data: null,
  });
});

export const passwordReset = asyncRequestHandler(async (req, res) => {
  const userData = req.body;
  const token = req.headers.authorization;

  const { email, new_password } = userData;

  if (!email || !new_password) {
    throw new APIError(400, 'All fields are required');
  }

  if (!token) {
    throw new APIError(401, 'No authentication token provided');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  const decoded = verifytoken(token, config.access_token_secret as string);

  if (user.email !== decoded.email) {
    throw new APIError(401, 'Invalid token');
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(new_password)) {
    throw new APIError(
      400,
      'New password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit.',
    );
  }

  const new_hashed_password = await bcrypt.hash(new_password, 10);

  await User.findOneAndUpdate(
    { email: decoded.email },
    {
      $set: {
        password: new_hashed_password,
      },
    },
  );

  sendApiResponse(res, {
    success: true,
    status: 200,
    message: 'Password changed successfully',
    data: null,
  });
});

export const refreshToken = asyncRequestHandler(async (req, res) => {
  const { refresh_token: token } = req.cookies;
  // console.log('🚀 ~ refreshToken ~ token:', token);

  const decoded = verifytoken(token, config.refresh_token_secret as string);
  // console.log('🚀 ~ refreshToken ~ decoded:', decoded);

  const user = await User.findOne({ _id: decoded._id });
  // console.log('🚀 ~ refreshToken ~ user:', user);

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  const access_token = user.generateAccessToken();

  sendApiResponse(res, {
    success: true,
    status: 200,
    message: 'Access token sent successfully',
    data: { access_token },
  });
});
