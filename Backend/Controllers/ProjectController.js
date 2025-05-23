import catchAsync from '../Utils/CatchAsync.js';
import ProjectManager from '../Managers/ProjectManager.js';

const getProjects = catchAsync(async (req, res, next) => {
  const user = req.user; 
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user',
    });
  }

  const result = await ProjectManager.getProjects(user);

  if (!result || result.data.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No projects yet',
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'Projects retrieved',
    data: result.data,
  });
});

const getOneProject = catchAsync(async (req, res, next) => {
  const user = req.user; 
  const projectId = req.params.id;

  if (!user || !projectId) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
    });
  }

  const result = await ProjectManager.getOneProject(user, projectId);

  res.status(200).json({
    success: true,
    message: 'Project retrieved successfully',
    data: result.data,
  });
});


const createProjects = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user',
    });
  }

  const { id, role } = user;

  if (role.toLowerCase() !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create projects',
    });
  }

  const result = await ProjectManager.createProject(req.body, id);

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: result.data,
  });
});
const assignProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user',
    });
  }

  const { id, role } = user;

  if (role.toLowerCase !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create projects',
    });
  }

  const result = await ProjectManager.assignProject(req.body, id);

  res.status(201).json({
    success: true,
    message: 'Project assigned successfully',
    data: result.data,
  });
});

export default { getProjects, createProjects , getOneProject ,assignProject};