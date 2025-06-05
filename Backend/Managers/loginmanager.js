import LoginHandler from '../Handlers/loginhandler.js';
import AppError from '../Utils/apperror.js';
import LoginUser from '../Utils/loginuser.js';
import Jwt from '../Utils/jwtverification.js';
import CryptoJS from 'crypto-js';
import keys from '../constants/keys.js';
import LoginConstants from '../constants/loginconstants.js';
import LoginUserValidation from '../Utils/loginuservalidation.js';

class LoginManager {
  static ENCRYPTION_KEY = keys.ENCRYPTION_KEY;

  static async login(user) {
    if (!user) {
      throw new AppError(LoginConstants.ERRORS.NOT_VALID_USER, 400);
    }
    const missingFields = LoginUserValidation(user);
    if (missingFields) {
      throw new AppError(LoginConstants.ERRORS.MISSING_FIELDS, 400);
    }
    const existingUser = await LoginHandler.findUserByEmail(user.email);
    if (!existingUser) {
      throw new AppError(LoginConstants.ERRORS.USER_NOT_FOUND, 404);
    }
    const bytes = CryptoJS.AES.decrypt(user.password, LoginManager.ENCRYPTION_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedPassword) {
      throw new AppError(LoginConstants.ERRORS.DECRYPTION_FAILED, 400);
    }
    const isMatch = await LoginUser(existingUser.password, decryptedPassword);
    if (!isMatch) {
      throw new AppError(LoginConstants.ERRORS.PASSWORD_MISMATCH, 401);
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
  }
}

export default LoginManager;


