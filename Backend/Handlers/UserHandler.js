import { User } from '../Models/index.js';

const getDeveloper = async () => {
  return await User.findAll({
    where: { role: 'Developer' },
    attributes: ['id', 'name', 'email']
  });
};
const getQA = async () => {
    return await User.findAll({
      where: { role: 'QA' },
      attributes: ['id', 'name', 'email']
    });
  };

export default {getDeveloper,getQA};
