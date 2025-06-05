import BugHandler from "../Handlers/bughandler.js";
import AppError from "../Utils/apperror.js";
import BugConstants from "../constants/bugsconstants.js";
import DataTypes from "../constants/datatypes.js";
import isEmptyString from "../Utils/emptystring.js";
import projectsFooterValidation from "../Utils/projectsfootervalidation.js";
import UserConstants from "../constants/usersconstants.js";
import getPagination from "../Utils/getprojectspagination.js";
import calculateOffset from "../Utils/calculateoffset.js";
import { checkBugsValidId } from "../Utils/checkbugsprojectid.js";
import { trimSearch } from "../Utils/trimsearch.js";
import { trimmedTitle } from "../Utils/trimandlowercasetitle.js";
class BugManager {
  static async getBugsByProject(user, projectIdRaw, searchTerm = null, page = 1, limit = 10) {
    if (!user) {
      throw new AppError(BugConstants.ERRORS.INVALID_USER_OR_PROJECT, 400);
    }

    const { id: userId, role } = user;
    const projectId = parseInt(projectIdRaw, 10);
    if (!userId || !role || !checkBugsValidId(projectId)) {
      throw new AppError(BugConstants.ERRORS.INVALID_USER_OR_PROJECT, 400);
    }
    if (!projectsFooterValidation(page, limit)) {
      throw new AppError(BugConstants.ERRORS.INVALID_PAGINATION, 400);
    }

    const roleLower = role.toLowerCase();
    const offset = calculateOffset(page, limit);
    let result;
    searchTerm = trimSearch(searchTerm);
    if (roleLower === UserConstants.ROLES.Manager) {
      const isProjectManager = await BugHandler.isProjectManager(userId, projectId);
      if (!isProjectManager) {
        throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
      }
      result = await BugHandler.getBugsByManager(userId, projectId, searchTerm, offset, limit);
    } else if (roleLower === UserConstants.ROLES.QA) {

      const isAssigned = await BugHandler.isProjectAssignedToUser(userId, projectId);
      if (!isAssigned) {
        throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
      }
      result = await BugHandler.getBugsByQA(userId, projectId, searchTerm, offset, limit);
    } else if (roleLower === UserConstants.ROLES.Developer) {
      const isAssigned = await BugHandler.isProjectAssignedToUser(userId, projectId);
      if (!isAssigned) {
        throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
      }
      result = await BugHandler.getBugsByDeveloper(userId, projectId, searchTerm, offset, limit);
    } else {
      throw new AppError(BugConstants.ERRORS.INVALID_ROLE, 403);
    }
    const { totalPages, hasNext, hasPrev } = getPagination(result.total, page, limit);

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
  }

  static async createBug(userId, projectIdRaw, bugData) {
    const projectId = parseInt(projectIdRaw, 10);
    if (!checkBugsValidId(projectId)) {
      throw new AppError(BugConstants.ERRORS.INVALID_PROJECT_ID, 400);
    }
    const isAssigned = await BugHandler.isProjectAssignedToUser(userId, projectId);
    if (!isAssigned) {
      throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
    }
    const trimmedBugTitle = trimmedTitle(bugData.title);
    const titleExists = await BugHandler.doesBugTitleExist(trimmedBugTitle, projectId);
    if (titleExists) {
      throw new AppError(BugConstants.ERRORS.DUPLICATE_TITLE, 400);
    }
    if (!bugData.type || !BugConstants.ALLOWED_TYPES.includes(bugData.type)) {
      throw new AppError(BugConstants.ERRORS.INVALID_TYPE(BugConstants.ALLOWED_TYPES), 400);
    }
    if (!bugData.status || typeof bugData.status !== DataTypes.STRING || isEmptyString(bugData.status)) {
      throw new AppError(BugConstants.ERRORS.STATUS_REQUIRED, 400);
    }

    const status = bugData.status.trim().toLowerCase();
    if (!BugConstants.ALLOWED_STATUSES.includes(status)) {
      throw new AppError(BugConstants.ERRORS.INVALID_STATUS(BugConstants.ALLOWED_STATUSES), 400);
    }
    if (bugData.screenshot && typeof bugData.screenshot === DataTypes.STRING) {
      const base64String = bugData.screenshot.split(",").pop();
      bugData.screenshot = Buffer.from(base64String, "base64");

      if (!Buffer.isBuffer(bugData.screenshot)) {
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
  }

  static async updateBugStatus(user, projectIdRaw, bugIdRaw, statusRaw) {
    const { id: userId, role } = user;
    const projectId = parseInt(projectIdRaw, 10);
    const bugId = parseInt(bugIdRaw, 10);
    if (role.toLowerCase() !== UserConstants.ROLES.Developer) {
      throw new AppError(BugConstants.ERRORS.STATUS_UPDATE_RESTRICTED, 403);
    }
    if (!checkBugsValidId(projectId)) {
      throw new AppError(BugConstants.ERRORS.INVALID_PROJECT_ID, 400);
    }
    if (!checkBugsValidId(bugId)) {
      throw new AppError(BugConstants.ERRORS.INVALID_BUG_ID, 400);
    }
    const isAssigned = await BugHandler.isUserAssignedToProject(userId, projectId);
    if (!isAssigned) {
      throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
    }
    const status = statusRaw?.trim();
    const allowedStatuses = BugConstants.ALLOWED_STATUSES;
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      throw new AppError(BugConstants.ERRORS.INVALID_STATUS(allowedStatuses), 400);
    }
    const bugExists = await BugHandler.isBugAssignedToDeveloper(userId, projectId, bugId);
    if (!bugExists) {
      throw new AppError(BugConstants.ERRORS.BUG_NOT_FOUND, 400);
    }
    const updatedBug = await BugHandler.updateBugStatus(userId, projectId, bugId, status);
    return updatedBug;
  }

  static async deleteBug(user, projectIdRaw, bugIdRaw) {
    const { id: userId, role } = user;
    const projectId = parseInt(projectIdRaw, 10);
    const bugId = parseInt(bugIdRaw, 10);
    if (role.toLowerCase() !== UserConstants.ROLES.QA) {
      throw new AppError(BugConstants.ERRORS.DELETE_RESTRICTED, 403);
    }
    if (!checkBugsValidId(projectId)) {
      throw new AppError(BugConstants.ERRORS.INVALID_PROJECT_ID, 400);
    }
    if (!checkBugsValidId(bugId)) {
      throw new AppError(BugConstants.ERRORS.INVALID_BUG_ID, 400);
    }
    const isAssigned = await BugHandler.isUserAssignedToProject(userId, projectId);
    if (!isAssigned) {
      throw new AppError(BugConstants.ERRORS.NOT_ASSIGNED, 403);
    }
    const bugExists = await BugHandler.isBugCreatedByUser(userId, projectId, bugId);
    if (!bugExists) {
      throw new AppError(BugConstants.ERRORS.BUG_NOT_FOUND, 400);
    }
    const deletedBug = await BugHandler.deleteBug(userId, projectId, bugId);
    return deletedBug;
  }
}

export default BugManager;;



