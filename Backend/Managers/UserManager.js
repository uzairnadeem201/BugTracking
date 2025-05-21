import UserHandler from '../Handlers/UserHandler.js';
import AppError from '../Utils/AppError.js';

const getDeveloper = async (user) => {
  const { id, role } = user;

  if (!id || !role) {
    throw new AppError('Invalid User data.', 400);
  }
  let Developer;
  if (role === 'Manager' || role ==='QA') {
    Developer = await UserHandler.getDeveloper();
  } 
  else {
    throw new AppError('Invalid role', 403);
  }

  return { data: Developer };
};
const getQA = async (user) => {
    const { id, role } = user;
  
    if (!id || !role) {
      throw new AppError('Invalid User data.', 400);
    }
    let Developer;
    if (role === 'Manager'){
      Developer = await UserHandler.getQA();
    } 
    else {
      throw new AppError('Invalid role', 403);
    }
  
    return { data: Developer };
  };
export default {getDeveloper,getQA};