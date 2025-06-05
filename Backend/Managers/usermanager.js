import UserHandler from '../Handlers/userhandler.js';
import AppError from '../Utils/apperror.js';
import UserConstants from '../constants/usersconstants.js';

const getDevelopersByProject = async (user, projectId) => {
  const { id, role } = user;
  if (!id || !role) throw new AppError('Invalid User data.', 400);

  const userRole = role.toLowerCase();
  if (userRole !== UserConstants.ROLES.Manager && userRole !== UserConstants.ROLES.QA) {
    throw new AppError('Invalid role', 403);
  }
  var developer = UserConstants.ROLES.Developer;

  const developers = await UserHandler.getUsersByProjectAndRole(projectId, developer);
  return { data: developers };
};

export default {
  getDevelopersByProject,
};