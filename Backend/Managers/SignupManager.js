import SignupHandler from '../Handlers/SignupHandler.js';
import AppError from '../Utils/AppError.js';
import hashPassword from '../Utils/HashPassword.js';
import validateUserInput from '../Utils/ValidateUserInput.js';

const validRoles = ['Manager', 'QA', 'Developer'];

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
  if (!validRoles.includes(role)) {
    return { success: false, error: new AppError('Invalid role selected.', 400) };
  }

  const existingUser = await SignupHandler.findUserByEmail(email);
  if (existingUser) {
    return { success: false, error: new AppError('Existing Email.', 409) };
  }

  const hashedPassword = await hashPassword(password);

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