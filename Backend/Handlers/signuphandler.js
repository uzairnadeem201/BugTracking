import { User } from '../Models/index.js';

class SignupHandler {
  static async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async createUser(user) {
    return await User.create(user);
  }
}

export default SignupHandler;






