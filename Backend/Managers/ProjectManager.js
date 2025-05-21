import ProjectHandler from '../Handlers/ProjectHandler.js';
import AppError from '../Utils/AppError.js';

const getProjects = async (user) => {
  const { id, role } = user;

  if (!id || !role) {
    throw new AppError('Invalid User data.', 400);
  }

  let projects;

  if (role === 'Manager') {
    projects = await ProjectHandler.getProjectsByManagerId(id);
  } else if (role === 'QA' || role === 'Developer') {
    projects = await ProjectHandler.getProjectsByUserId(id);
  } else {
    throw new AppError('Invalid role', 403);
  }

  return { data: projects };
};
const getOneProject = async (user, projectId) => {
  const { id, role } = user;

  if (!id || !role || !projectId) {
    throw new AppError('Invalid User or Project data.', 400);
  }

  let project;

  if (role === 'Manager') {
    project = await ProjectHandler.getProjectByManagerId(projectId, id);
  } else if (role === 'QA' || role === 'Developer') {
    project = await ProjectHandler.getProjectByUserId(projectId, id);
  } else {
    throw new AppError('Invalid role', 403);
  }

  if (!project) {
    throw new AppError('Project not found or unauthorized access', 404);
  }

  return { data: project };
};

const createProject = async (projectData, userId) => {
  const { title } = projectData;

  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const createdProject = await ProjectHandler.createProject(projectData, userId);
  
  return { data: createdProject };
};
const assignProject = async (user, userId) => {
  const {userToAssign , projectId} = user;
  console.log(userToAssign,projectId);

  if (!userToAssign) {
    throw new AppError('user is required', 400);
  }

  const assignedUser = await ProjectHandler.assignProject(userToAssign,projectId, userId);
  
  return { data: assignedUser };
};


export default { getProjects,createProject,getOneProject ,assignProject};