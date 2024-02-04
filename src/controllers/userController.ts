import config from '../config';
import { User } from '../models/userModel';
import { APIError } from '../utils/ApiError';
import { asyncRequestHandler } from '../utils/asyncRequestHandler';
import { sendApiResponse } from '../utils/sendApiResponse';

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
