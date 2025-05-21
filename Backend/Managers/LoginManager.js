import LoginHandler from '../Handlers/LoginHandler.js';
import AppError from '../Utils/AppError.js';
import Jwt from '../Utils/JwtVerification.js';

const login = async (user) => {
  const { email, password } = user;
  
  if (!email || !password) {
    throw new AppError('All fields are required.', 400);
  }

  const existingUser = await LoginHandler.findUserByEmail(email);
  if (!existingUser) {
    throw new AppError('Invalid Email or Password', 404);
  }

  const isMatch = await LoginHandler.loginUser(existingUser.password, password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 404);
  }

  const token = Jwt.signToken({ id: existingUser.id, role: existingUser.role });

  return {
    token,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    },
  };
};

export default { login };