import { User } from '../Models/index.js';

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async (user) => {
  return await User.create(user);
};

export default { findUserByEmail, createUser };




