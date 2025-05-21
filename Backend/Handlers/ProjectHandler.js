import { User, Project,UsersProjects, sequelize } from '../Models/index.js';
import AppError from '../Utils/AppError.js';

const getProjectsByManagerId = async (managerId) => {
  return await Project.findAll({ where: { created_by: managerId } });
};

const getProjectsByUserId = async (userId) => {
  const userProjects = await sequelize.query(
    'SELECT project_id FROM users_projects WHERE user_id = :userId',
    {
      replacements: { userId },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  const projectIds = userProjects.map(row => row.project_id);

  if (projectIds.length === 0) return [];

  return await Project.findAll({
    where: {
      id: projectIds,
    },
  });
};
const getProjectByManagerId = async (projectId, managerId) => {
  return await Project.findOne({
    where: {
      id: projectId,
      created_by: managerId
    }
  });
};

const getProjectByUserId = async (projectId, userId) => {
  const userProject = await sequelize.query(
    'SELECT * FROM users_projects WHERE user_id = :userId AND project_id = :projectId',
    {
      replacements: { userId, projectId },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (userProject.length === 0) return null;

  return await Project.findOne({
    where: { id: projectId }
  });
};


const createProject = async (projectData, userId) => {
  return await Project.create({
    ...projectData,
    created_by: userId
  });
};
const assignProject = async (userIdToAssign, projectId, managerId) => {
  console.log(projectId,managerId);
  const project = await Project.findOne({
    where: {
      id: projectId,
      created_by: managerId
    }
  });

  if (!project) {
    throw new AppError('Project not found or you are not the manager.', 403);
  }
  const userToAssign = await User.findOne({
    where: {
      id: userIdToAssign,
      role: ['QA', 'Developer']
    }
  });

  if (!userToAssign) {
    throw new AppError('User not found or not eligible for assignment.', 404);
  }

  const existingAssignment = await UsersProjects.findOne({
    where: {
      user_id: userIdToAssign,
      project_id: projectId
    }
  });

  if (existingAssignment) {
    throw new AppError('User is already assigned to this project.', 400);
  }
  await UsersProjects.create({
    user_id: userIdToAssign,
    project_id: projectId
  });

  return {
    message: 'User successfully assigned to project',
    user: {
      id: userToAssign.id,
      name: userToAssign.name,
      role: userToAssign.role
    },
    project: {
      id: project.id,
      title: project.title
    }
  };
};

export default { getProjectsByManagerId, getProjectsByUserId , createProject,getProjectByManagerId,getProjectByUserId,assignProject};
