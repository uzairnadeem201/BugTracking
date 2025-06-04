import { User } from '../Models/index.js';

class LoginHandler {
  static async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }
}

export default LoginHandler;

