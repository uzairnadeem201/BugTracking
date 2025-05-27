import { User, Project, UsersProjects, sequelize } from "../Models/index.js"
import { Op } from "sequelize"
import AppError from "../Utils/AppError.js"

const getProjectsByManagerId = async (managerId, searchTerm = null) => {
  const whereClause = { created_by: managerId }

  if (searchTerm && searchTerm.trim() !== "") {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm.trim()}%` } },
      { description: { [Op.iLike]: `%${searchTerm.trim()}%` } },
    ]
  }

  return await Project.findAll({ where: whereClause })
}

const getProjectsByUserId = async (userId, searchTerm = null) => {
  const userProjects = await sequelize.query("SELECT project_id FROM users_projects WHERE user_id = :userId", {
    replacements: { userId },
    type: sequelize.QueryTypes.SELECT,
  })

  const projectIds = userProjects.map((row) => row.project_id)

  if (projectIds.length === 0) return []

  const whereClause = { id: projectIds }

  if (searchTerm && searchTerm.trim() !== "") {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm.trim()}%` } },
      { description: { [Op.iLike]: `%${searchTerm.trim()}%` } },
    ]
  }

  return await Project.findAll({
    where: whereClause,
  })
}

const getProjectByManagerId = async (projectId, managerId) => {
  return await Project.findOne({
    where: {
      id: projectId,
      created_by: managerId,
    },
  })
}

const getProjectByUserId = async (projectId, userId) => {
  const userProject = await sequelize.query(
    "SELECT * FROM users_projects WHERE user_id = :userId AND project_id = :projectId",
    {
      replacements: { userId, projectId },
      type: sequelize.QueryTypes.SELECT,
    },
  )

  if (userProject.length === 0) return null

  return await Project.findOne({
    where: { id: projectId },
  })
}

const createProject = async (projectData, userId) => {
  return await Project.create({
    ...projectData,
    created_by: userId,
  })
}

const assignProject = async (userIdToAssign, projectId, managerId) => {
  console.log(projectId, managerId)
  const project = await Project.findOne({
    where: {
      id: projectId,
      created_by: managerId,
    },
  })

  if (!project) {
    throw new AppError("Project not found or you are not the manager.", 403)
  }

  const userToAssign = await User.findOne({
    where: {
      id: userIdToAssign,
      role: ["QA", "Developer"],
    },
  })

  if (!userToAssign) {
    throw new AppError("User not found or not eligible for assignment.", 404)
  }

  const existingAssignment = await UsersProjects.findOne({
    where: {
      user_id: userIdToAssign,
      project_id: projectId,
    },
  })

  if (existingAssignment) {
    throw new AppError("User is already assigned to this project.", 400)
  }

  await UsersProjects.create({
    user_id: userIdToAssign,
    project_id: projectId,
  })

  return {
    message: "User successfully assigned to project",
    user: {
      id: userToAssign.id,
      name: userToAssign.name,
      role: userToAssign.role,
    },
    project: {
      id: project.id,
      title: project.title,
    },
  }
}

const getProjectByTitleAndManagerId = async (title, created_by) => {
  console.log("Checking project title for manager...")
  const normalizedInput = title.replace(/\s+/g, "").toLowerCase()
  const allProjects = await Project.findAll({
    where: { created_by },
    attributes: ["id", "title"],
  })
  const matchingProject = allProjects.find((project) => {
    const normalizedProjectTitle = project.title.replace(/\s+/g, "").toLowerCase()
    return normalizedProjectTitle === normalizedInput
  })

  return matchingProject || null
}

export default {
  getProjectsByManagerId,
  getProjectsByUserId,
  createProject,
  getProjectByManagerId,
  getProjectByUserId,
  assignProject,
  getProjectByTitleAndManagerId,
}

