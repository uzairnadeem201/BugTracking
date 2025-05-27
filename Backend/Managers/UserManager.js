import UserHandler from '../Handlers/UserHandler.js';
import AppError from '../Utils/AppError.js';

const getDevelopersByProject = async (user, projectId) => {
  const { id, role } = user;
  if (!id || !role) throw new AppError('Invalid User data.', 400);

  const userRole = role.toLowerCase();
  if (userRole !== 'manager' && userRole !== 'qa') {
    throw new AppError('Invalid role', 403);
  }

  const developers = await UserHandler.getUsersByProjectAndRole(projectId, 'Developer');
  return { data: developers };
};

const getQAsByProject = async (user, projectId) => {
  const { id, role } = user;
  if (!id || !role) throw new AppError('Invalid User data.', 400);

  const userRole = role.toLowerCase();

  if (userRole !== 'manager') {
    throw new AppError('Invalid role', 403);
  }

  const qa = await UserHandler.getUsersByProjectAndRole(projectId, 'QA');
  return { data: qa };
};

export default {
  getDevelopersByProject,
  getQAsByProject,
};

