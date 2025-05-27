import { Bug, Project, sequelize } from '../Models/index.js';
import { Op, fn, col, where } from 'sequelize';

const getBugsByManager = async (managerId, projectId, searchTerm = null) => {
  const project = await Project.findOne({
    where: { id: projectId, created_by: managerId }
  });
  if (!project) return [];

  const whereClause = { project_id: projectId };

  if (searchTerm && searchTerm.trim() !== '') {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm.trim()}%` } }
    ];
  }

  return await Bug.findAll({
    where: whereClause
  });
};

const getBugsByQA = async (userId, projectId, searchTerm = null) => {
  const userProject = await sequelize.query(
    'SELECT 1 FROM users_projects WHERE user_id = :userId AND project_id = :projectId',
    {
      replacements: { userId, projectId },
      type: sequelize.QueryTypes.SELECT
    }
  );

  if (userProject.length === 0) return [];

  const whereClause = {
    project_id: projectId,
    created_by: userId
  };

  if (searchTerm && searchTerm.trim() !== '') {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm.trim()}%` } }
    ];
  }

  return await Bug.findAll({
    where: whereClause
  });
};

const getBugsByDeveloper = async (userId, projectId, searchTerm = null) => {
  const userProject = await sequelize.query(
    'SELECT 1 FROM users_projects WHERE user_id = :userId AND project_id = :projectId',
    {
      replacements: { userId, projectId },
      type: sequelize.QueryTypes.SELECT
    }
  );

  if (userProject.length === 0) return [];

  const whereClause = {
    project_id: projectId,
    assigned_to: userId
  };

  if (searchTerm && searchTerm.trim() !== '') {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm.trim()}%` } }
    ];
  }

  return await Bug.findAll({
    where: whereClause
  });
};

const isProjectAssignedToUser = async (userId, projectId) => {
  const result = await sequelize.query(
    'SELECT 1 FROM users_projects WHERE user_id = :userId AND project_id = :projectId LIMIT 1',
    {
      replacements: { userId, projectId },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result.length > 0;
};

const isUserAssignedToProject = async (userId, projectId) => {
  const result = await sequelize.query(
    'SELECT * FROM users_projects WHERE user_id = :userId AND project_id = :projectId',
    {
      replacements: { userId, projectId },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result.length > 0;
};

const createBug = async (bug) => {
  const existingBug = await Bug.findOne({
    where: {
      title: bug.title,
      project_id: bug.project_id
    }
  });

  if (existingBug) {
    throw new Error('Bug title must be unique within the same project.');
  }

  return await Bug.create(bug);
};

const updateBugStatus = async (userId, projectId, bugId, newStatus) => {
  const bug = await Bug.findOne({
    where: {
      id: bugId,
      project_id: projectId,
      assigned_to: userId
    }
  });

  if (!bug) return null;

  bug.status = newStatus;
  await bug.save();

  return bug;
};

const deleteBug = async (userId, projectId, bugId) => {
  const bug = await Bug.findOne({
    where: {
      id: bugId,
      project_id: projectId,
      created_by: userId
    }
  });

  if (!bug) return null;

  await bug.destroy();
  return bug;
};

const doesBugTitleExist = async (title, projectId) => {
  const trimmedTitle = typeof title === 'string' ? title.trim().toLowerCase() : '';
  const result = await Bug.findOne({
    where: {
      project_id: projectId,
      [Op.and]: [
        where(fn('LOWER', fn('TRIM', col('title'))), trimmedTitle)
      ]
    }
  });

  return result !== null;
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
  doesBugTitleExist
};




