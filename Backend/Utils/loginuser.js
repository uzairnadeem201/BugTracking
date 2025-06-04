import comparePassword from './ComparePassword.js';
const loginUser = async (hashedPassword, password) => {
  const isValid = await comparePassword(password, hashedPassword);
  if (!isValid) {
    return false;
  }
  return true;
};
export default loginUser;