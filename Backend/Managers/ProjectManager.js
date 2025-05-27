import ProjectHandler from "../Handlers/ProjectHandler.js"
import AppError from "../Utils/AppError.js"

const getProjects = async (user, search = null) => {
  const { id, role } = user

  if (!id || !role) {
    throw new AppError("Invalid User data.", 400)
  }

  let projects
  const roleLower = role.toLowerCase()

  if (roleLower === "manager") {
    projects = await ProjectHandler.getProjectsByManagerId(id, search)
  } else if (roleLower === "qa" || roleLower === "developer") {
    projects = await ProjectHandler.getProjectsByUserId(id, search)
  } else {
    throw new AppError("Invalid role", 403)
  }

  return { data: projects }
}

const getOneProject = async (user, projectId) => {
  const { id, role } = user

  if (!id || !role || !projectId) {
    throw new AppError("Invalid User or Project data.", 400)
  }

  let project
  const roleLower = role.toLowerCase()

  if (roleLower === "manager") {
    project = await ProjectHandler.getProjectByManagerId(projectId, id)
  } else if (roleLower === "qa" || roleLower === "developer") {
    project = await ProjectHandler.getProjectByUserId(projectId, id)
  } else {
    throw new AppError("Invalid role", 403)
  }

  if (!project) {
    throw new AppError("Project not found or unauthorized access", 404)
  }

  return { data: project }
}

const createProject = async (projectData, userId) => {
  const { title } = projectData

  if (!title || title.trim() === "") {
    throw new AppError("Title is required", 400)
  }

  const trimmedTitle = title.trim()
  const existingProject = await ProjectHandler.getProjectByTitleAndManagerId(trimmedTitle, userId)

  if (existingProject) {
    throw new AppError("Project with this title already exists.", 409)
  }

  const createdProject = await ProjectHandler.createProject({ ...projectData, title: trimmedTitle }, userId)

  return { data: createdProject }
}

const assignProject = async (user, userId) => {
  const { userToAssign, projectId } = user

  if (!userToAssign || userToAssign.toString().trim() === "") {
    throw new AppError("User to assign is required and cannot be empty.", 400)
  }

  if (!projectId || projectId.toString().trim() === "") {
    throw new AppError("Project ID is required and cannot be empty.", 400)
  }

  const assignedUser = await ProjectHandler.assignProject(userToAssign, projectId, userId)
  return { data: assignedUser }
}

export default {
  getProjects,
  createProject,
  getOneProject,
  assignProject,
}
