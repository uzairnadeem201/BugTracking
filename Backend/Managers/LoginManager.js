import LoginHandler from '../Handlers/LoginHandler.js';
import AppError from '../Utils/AppError.js';
import Jwt from '../Utils/JwtVerification.js';
import CryptoJS from 'crypto-js';

const login = async (user) => {
    const ENCRYPTION_KEY = "key";
  const { email, password } = user;
  
  if (!email || !password) {
    throw new AppError('All fields are required.', 400);
  }

  const existingUser = await LoginHandler.findUserByEmail(email);
  if (!existingUser) {
    throw new AppError('Invalid Email or Password', 404);
  }
  const encryptedPassword = password;
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY)
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)
  
    if (!decryptedPassword) {
      return res.status(400).json({ message: "Failed to decrypt password" })
    }

  const isMatch = await LoginHandler.loginUser(existingUser.password, decryptedPassword);
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