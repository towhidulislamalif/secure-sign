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
