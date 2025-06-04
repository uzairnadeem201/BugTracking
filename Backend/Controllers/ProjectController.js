import ProjectManager from "../Managers/ProjectManager.js";
import ProjectsLengthValidator from "../Utils/projectslengthvalidator.js";

class ProjectController {
  static async getProjects(req, res, next) {
    try {
      const user = req.user;
      const { search, page = 1, limit = 10 } = req.query;
      const result = await ProjectManager.getProjects(user, search, page, limit);

      res.status(200).json({
        success: true,
        message: ProjectsLengthValidator(result)
          ? (search ? "Search results retrieved" : "Projects retrieved")
          : (search ? "No projects found matching your search" : "No projects yet"),
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      console.error("Get Projects Error:", err);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to retrieve projects",
      });
    }
  }

  static async getOneProject(req, res, next) {
    try {
      const user = req.user;
      const projectId = req.params.id;

      const result = await ProjectManager.getOneProject(user, projectId);

      res.status(200).json({
        success: true,
        message: "Project retrieved successfully",
        data: result.data,
      });
    } catch (err) {
      console.error("Get One Project Error:", err);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to retrieve project",
      });
    }
  }

  static async createProject(req, res, next) {
    try {
      const result = await ProjectManager.createProject(req);

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: result.data,
      });
    } catch (err) {
      console.error("Create Project Error:", err);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to create project",
      });
    }
  }
}
export default ProjectController;
