import ProjectHandler from "../Handlers/ProjectHandler.js";
import AppError from "../Utils/AppError.js";
import ProjectConstants from "../constants/projectsconstants.js";
import projectsFooterValidation from "../Utils/projectsfootervalidation.js";
import getProjectsPagination from "../Utils/getprojectspagination.js";
import UserConstants from "../constants/usersconstants.js";
import calculateOffset from "../Utils/calculateoffset.js";
import buildSearchClause from "../Utils/buildsearchclause.js";
import normalizeTitle from "../Utils/projectstitlevalidation.js";
import isDuplicateTitle from "../Utils/isprojectduplicate.js";
import checkLength from "../Utils/checklength.js";
class ProjectManager {
  static async getProjects(user, search = null, pageNum = 1, limitNum = 10) {
    if (!user || !user.id || !user.role) {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.INVALID_USER_DATA, 400);
    }

    const { id, role } = user;
    const page = parseInt(pageNum);
    const limit = parseInt(limitNum);
    const offset = calculateOffset(page, limit);
    const roleLower = role.toLowerCase();

    const whereClause = buildSearchClause(search);

    let result;

    if (roleLower === UserConstants.ROLES.Manager) {
      result = await ProjectHandler.getProjectsByManagerId(id, whereClause, limit, offset);
    } else if (
      roleLower === UserConstants.ROLES.QA ||
      roleLower === UserConstants.ROLES.Developer
    ) {
      const projectIds = await ProjectHandler.getUserProjectIds(id);
      if (checkLength(projectIds)) {
        return {
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      result = await ProjectHandler.getProjectsByUserProjectIds(projectIds, whereClause, limit, offset);
    } else {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.INVALID_ROLE, 403);
    }

    if (projectsFooterValidation(page, limit)) {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.INVALID_PAGINATION, 400);
    }

    const { totalPages, hasNext, hasPrev } = getProjectsPagination(result.total, page, limit);

    return {
      data: result.projects,
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

  static async getOneProject(user, projectId) {
    const { id, role } = user;

    if (!id || !role || !projectId) {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.INVALID_USER_DATA, 400);
    }

    const roleLower = role.toLowerCase();

    if (roleLower === UserConstants.ROLES.Manager) {
      const project = await ProjectHandler.getProjectById(projectId);
      if (!project || project.created_by !== id) {
        throw new AppError(ProjectConstants.ERROR_MESSAGES.PROJECT_NOT_FOUND_OR_UNAUTHORIZED, 404);
      }
      return { data: project };
    } else if (
      roleLower === UserConstants.ROLES.QA ||
      roleLower === UserConstants.ROLES.Developer
    ) {
      const projectIds = await ProjectHandler.getUserProjectIds(id);
      if (!projectIds.includes(projectId)) {
        throw new AppError(ProjectConstants.ERROR_MESSAGES.PROJECT_NOT_FOUND_OR_UNAUTHORIZED, 404);
      }
      const project = await ProjectHandler.getProjectById(projectId);
      return { data: project };
    } else {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.INVALID_ROLE, 403);
    }
  }

  static async createProject(req) {
    const user = req.user;
    const { id, role } = user;

    if (role.toLowerCase() !== UserConstants.ROLES.Manager) {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.NOT_AUTHORIZED_TO_CREATE, 403);
    }

    const { title } = req.body;

    if (!title) {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.TITLE_REQUIRED, 400);
    }

    const trimmedTitle = title.trim();
    const normalizedInput = normalizeTitle(trimmedTitle);

    const existingProjects = await ProjectHandler.getAllProjectTitlesByManager(id);

    const isDuplicate = isDuplicateTitle(normalizedInput, existingProjects);

    if (isDuplicate) {
      throw new AppError(ProjectConstants.ERROR_MESSAGES.PROJECT_TITLE_EXISTS, 409);
    }

    const createdProject = await ProjectHandler.createProject(
      { ...req.body, title: trimmedTitle },
      id
    );

    return { data: createdProject };
  }
}

export default ProjectManager;

