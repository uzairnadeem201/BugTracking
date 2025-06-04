import BugHandler from '../Handlers/BugHandler.js';
import AppError from '../Utils/AppError.js';
import BugConstants from '../constants/bugsconstants.js';
import DataTypes from '../constants/datatypes.js';
import isEmptyString  from '../Utils/emptystring.js';

const getBugsByProject = async (user, projectIdRaw, searchTerm = null, page = 1, limit = 10) => {
  const { id: userId, role } = user;
  const projectId = parseInt(projectIdRaw, 10);

  if (!userId || !role || isNaN(projectId)) {
    throw new AppError('Invalid User or Project ID.', 400);
  }

  const roleLower = role.toLowerCase();
  let result;

  if (roleLower === 'manager') {
    result = await BugHandler.getBugsByManager(userId, projectId, searchTerm, page, limit);
  } else if (roleLower === 'qa') {
    result = await BugHandler.getBugsByQA(userId, projectId, searchTerm, page, limit);
  } else if (roleLower === 'developer') {
    result = await BugHandler.getBugsByDeveloper(userId, projectId, searchTerm, page, limit);
  } else {
    throw new AppError('Invalid role', 403);
  }
  const totalPages = Math.ceil(result.total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    data: result.bugs,
    pagination: {
      total: result.total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    },
  };
};

const createBug = async (userId, projectIdRaw, bugData) => {
  const projectId = parseInt(projectIdRaw, 10);
  if (isNaN(projectId)) {
    throw new AppError(BugConstants.ERRORS.INVALID_PROJECT_ID, 400);
  }

  const isAssigned = await BugHandler.isProjectAssignedToUser(userId, projectId);
  if (!isAssigned) {
    throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
  }

  const titleExists = await BugHandler.doesBugTitleExist(bugData.title, projectId);
  if (titleExists) {
    throw new AppError(BugConstants.ERRORS.DUPLICATE_TITLE, 400);
  }

  if (!bugData.type || !BugConstants.ALLOWED_TYPES.includes(bugData.type)) {
    throw new AppError(
      BugConstants.ERRORS.INVALID_TYPE(BugConstants.ALLOWED_TYPES),
      400
    );
  }

  if (!bugData.status || typeof bugData.status !== DataTypes.STRING || isEmptyString(bugData.status)) {
    throw new AppError(BugConstants.ERRORS.STATUS_REQUIRED, 400);
  }

  const status = bugData.status.trim();
  if (!BugConstants.ALLOWED_STATUSES.includes(status)) {
    throw new AppError(
      BugConstants.ERRORS.INVALID_STATUS(BugConstants.ALLOWED_STATUSES),
      400
    );
  }

  if (bugData.screenshot && typeof bugData.screenshot === 'string') {
    const base64String = bugData.screenshot.split(',').pop();
    bugData.screenshot = Buffer.from(base64String, 'base64');

    if (!Buffer.isBuffer(bugData.screenshot) || bugData?.screenshot?.length === 0) {
      throw new AppError(BugConstants.ERRORS.INVALID_SCREENSHOT, 400);
    }
  }

  const bug = {
    ...bugData,
    status,
    project_id: projectId,
    created_by: userId,
  };

  return await BugHandler.createBug(bug);
};

const updateBugStatus = async (user, projectIdRaw, bugIdRaw, statusRaw) => {
  const { id: userId, role } = user;
  const projectId = parseInt(projectIdRaw, 10);
  const bugId = parseInt(bugIdRaw, 10);

  if (role.toLowerCase() !== 'developer') {
    throw new AppError('Only developers can update bug status', 403);
  }

  if (isNaN(projectId)) {
    throw new AppError('Invalid Project ID', 400);
  }
  if (isNaN(bugId)) {
    throw new AppError('Invalid Bug ID', 400);
  }

  const isAssigned = await BugHandler.isUserAssignedToProject(userId, projectId);
  if (!isAssigned) {
    throw new AppError('You are not assigned to this project', 403);
  }

  const status = statusRaw?.trim();
  const allowedStatuses = ['pending', 'in progress', 'closed'];
  if (!status || !allowedStatuses.includes(status.toLowerCase())) {
    throw new AppError(`Status must be one of: ${allowedStatuses.join(', ')}`, 400);
  }

  const updatedBug = await BugHandler.updateBugStatus(userId, projectId, bugId, status);
  if (!updatedBug) {
    throw new AppError('Bug not found', 400);
  }

  return updatedBug;
};

const deleteBug = async (user, projectIdRaw, bugIdRaw) => {
  const { id: userId, role } = user;
  const projectId = parseInt(projectIdRaw, 10);
  const bugId = parseInt(bugIdRaw, 10);

  if (role.toLowerCase() !== 'qa') {
    throw new AppError('Only QA can delete bug', 403);
  }

  if (isNaN(projectId)) {
    throw new AppError('Invalid Project ID', 400);
  }
  if (isNaN(bugId)) {
    throw new AppError('Invalid Bug ID', 400);
  }

  const isAssigned = await BugHandler.isUserAssignedToProject(userId, projectId);
  if (!isAssigned) {
    throw new AppError('You are not assigned to this project', 403);
  }

  const deletedBug = await BugHandler.deleteBug(userId, projectId, bugId);
  if (!deletedBug) {
    throw new AppError('Bug doesn\'t exist', 400);
  }

  return deletedBug;
};

export default {
  getBugsByProject,
  createBug,
  updateBugStatus,
  deleteBug,
};

