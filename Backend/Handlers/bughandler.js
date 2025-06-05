import { Bug, Project, UsersProjects } from '../Models/index.js';
import { Op, fn, col, where } from 'sequelize';

const isProjectAssignedToUser = async (userId, projectId) => {
  const assignment = await UsersProjects.findOne({
    where: { user_id: userId, project_id: projectId }
  });
  return !!assignment;
};

const isUserAssignedToProject = isProjectAssignedToUser;

const isProjectManager = async (managerId, projectId) => {
  const project = await Project.findOne({
    where: { id: projectId, created_by: managerId }
  });
  return !!project;
};

const isBugAssignedToDeveloper = async (userId, projectId, bugId) => {
  const bug = await Bug.findOne({
    where: {
      id: bugId,
      project_id: projectId,
      assigned_to: userId,
    }
  });
  return !!bug;
};

const isBugCreatedByUser = async (userId, projectId, bugId) => {
  const bug = await Bug.findOne({
    where: {
      id: bugId,
      project_id: projectId,
      created_by: userId,
    }
  });
  return !!bug;
};

const getBugsByManager = async (managerId, projectId, searchTerm = null, offset, limit = 10) => {
  const whereClause = { project_id: projectId };
  whereClause.title = { [Op.iLike]: `%${searchTerm.trim()}%` };
  const result = await Bug.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });

  return { bugs: result.rows, total: result.count };
};

const getBugsByQA = async (userId, projectId, searchTerm = null, offset, limit = 10) => {
  const whereClause = {
    project_id: projectId,
    created_by: userId,
  };
  whereClause.title = { [Op.iLike]: `%${searchTerm.trim()}%` };
  const result = await Bug.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });

  return { bugs: result.rows, total: result.count };
};

const getBugsByDeveloper = async (userId, projectId, searchTerm = null, offset, limit = 10) => {
  const whereClause = {
    project_id: projectId,
    assigned_to: userId,
  };
    whereClause.title = { [Op.iLike]: `%${searchTerm.trim()}%` };
  const result = await Bug.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });

  return { bugs: result.rows, total: result.count };
};

const createBug = async (bug) => {
  return await Bug.create(bug);
};

const updateBugStatus = async (userId, projectId, bugId, newStatus) => {
  const bug = await Bug.findOne({
    where: {
      id: bugId,
      project_id: projectId,
      assigned_to: userId,
    },
  });

  bug.status = newStatus;
  await bug.save();

  return bug;
};

const deleteBug = async (userId, projectId, bugId) => {
  const bug = await Bug.findOne({
    where: {
      id: bugId,
      project_id: projectId,
      created_by: userId,
    },
  });

  await bug.destroy();
  return bug;
};

const doesBugTitleExist = async (title, projectId) => {
  const result = await Bug.findOne({
    where: {
      project_id: projectId,
      [Op.and]: [
        where(fn('LOWER', fn('TRIM', col('title'))), title)
      ]
    }
  });

  return !!result;
};

export default {
  getBugsByManager,
  getBugsByQA,
  getBugsByDeveloper,
  createBug,
  isProjectAssignedToUser,
  updateBugStatus,
  isUserAssignedToProject,
  deleteBug,
  doesBugTitleExist,
  isProjectManager,
  isBugAssignedToDeveloper,
  isBugCreatedByUser
};




