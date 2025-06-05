import SignupHandler from '../Handlers/signuphandler.js';
import AppError from '../Utils/apperror.js';
import hashPassword from '../Utils/hashpassword.js';
import validateUserInput from '../Utils/validateuserinput.js';
import CryptoJS from 'crypto-js';
import keys from '../constants/keys.js';
import UserConstants from '../constants/usersconstants.js';
import SignupConstants from '../constants/signupconstants.js';
import ErrorMessages from '../Utils/compilesignuperror.js';

class SignupManager {
  static ENCRYPTION_KEY = keys.ENCRYPTION_KEY;

  static async signup(user) {
    const validationResult = validateUserInput(user);
    if (!validationResult.success) {
      const errorMessages = ErrorMessages(validationResult);
      throw new AppError(errorMessages, 400);
    }
    const { name, email, phonenumber, password, role } = user;
    const validRoles = Object.values(UserConstants.ROLES);
    if (!validRoles.includes(role.toLowerCase())) {
      throw new AppError(SignupConstants.ERRORS.INVALID_ROLE, 400);
    }
    const existingUser = await SignupHandler.findUserByEmail(email);
    if (existingUser) {
      throw new AppError(SignupConstants.ERRORS.EXISTING_EMAIL, 409);
    }
    const bytes = CryptoJS.AES.decrypt(password, SignupManager.ENCRYPTION_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedPassword) {
      throw new AppError(SignupConstants.ERRORS.DECRYPTION_FAILED, 400);
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
      message: SignupConstants.SUCCESS.USER_CREATED,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }
}

export default SignupManager;

