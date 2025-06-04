import { Project, UsersProjects } from "../Models/index.js";
import { Op } from "sequelize";

class ProjectHandler {
  static async getProjectsByManagerId(managerId, whereClause = {}, limit = 10, offset = 0) {
    const result = await Project.findAndCountAll({
      where: {
        created_by: managerId,
        ...whereClause,
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      projects: result.rows,
      total: result.count,
    };
  }

  static async getProjectsByUserProjectIds(projectIds, whereClause = {}, limit = 10, offset = 0) {
    const result = await Project.findAndCountAll({
      where: {
        id: { [Op.in]: projectIds },
        ...whereClause,
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      projects: result.rows,
      total: result.count,
    };
  }

  static async getUserProjectIds(userId) {
    const userProjects = await UsersProjects.findAll({
      where: { user_id: userId },
      attributes: ["project_id"],
    });

    return userProjects.map((up) => up.project_id);
  }

  static async getProjectById(projectId) {
    return await Project.findOne({
      where: { id: projectId },
    });
  }

  static async createProject(projectData, userId) {
    return await Project.create({
      ...projectData,
      created_by: userId,
    });
  }

  static async getAllProjectTitlesByManager(created_by) {
    return await Project.findAll({
      where: { created_by },
      attributes: ["id", "title"],
    });
  }
}

export default ProjectHandler;


