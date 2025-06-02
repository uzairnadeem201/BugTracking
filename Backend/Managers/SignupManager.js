import SignupHandler from '../Handlers/SignupHandler.js';
import AppError from '../Utils/AppError.js';
import hashPassword from '../Utils/HashPassword.js';
import validateUserInput from '../Utils/ValidateUserInput.js';
import CryptoJS from 'crypto-js';

const validRoles = ['manager', 'qa', 'developer'];

const signup = async (user) => {
  const result = validateUserInput(user);
  if (!result.success) {
    const errorMessages = result.errors.map(err => err.message).join(', ');
    return {
      success: false,
      error: new AppError(errorMessages, 400),
    };
  }
  const { name, email, phonenumber, password, role } = user;
  if (!validRoles.includes(role.toLowerCase())) {
    return { success: false, error: new AppError('Invalid role selected.', 400) };
  }

  const existingUser = await SignupHandler.findUserByEmail(email);
  if (existingUser) {
    return { success: false, error: new AppError('Existing Email.', 409) };
  }
  const ENCRYPTION_KEY = "key";

  const encryptedPassword = password;
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY)
  const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)

  if (!decryptedPassword) {
    return res.status(400).json({ message: "Failed to decrypt password" })
  }

  const hashedPassword = await hashPassword(decryptedPassword);

  const newUser = await SignupHandler.createUser({
    name,
    email,
    phonenumber,
    password: hashedPassword,
    role,
  });

  return {
    success: true,
    message: 'User created successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

export default { signup };