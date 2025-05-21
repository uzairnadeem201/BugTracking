import { User } from '../Models/index.js';
import comparePassword from '../Utils/ComparePassword.js';

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};
const loginUser = async (hashedPassword, password) => {
  const isValid = await comparePassword(password, hashedPassword);
  if (!isValid) {
    return false;
  }
  return true;
};
export default {findUserByEmail,loginUser};