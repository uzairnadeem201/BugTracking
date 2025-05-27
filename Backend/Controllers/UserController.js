import catchAsync from "../Utils/CatchAsync.js";
import UserManager from "../Managers/UserManager.js";
import AppError from "../Utils/AppError.js";
const getDevelopersByProject = catchAsync(async (req, res) => {
  const user = req.user;
  const rawProjectId = req.params.id;
  const projectId = parseInt(rawProjectId, 10);

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid user' });
  }
  if (isNaN(projectId) || projectId <= 0) {
    throw new AppError('Invalid project ID', 400);
  }

  const result = await UserManager.getDevelopersByProject(user, projectId);

  if (!result || result.data.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No Developers found',
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'Developers retrieved',
    data: result.data,
  });
});

const getQAsByProject = catchAsync(async (req, res) => {
  const user = req.user;
  const rawProjectId = req.params.id;
  const projectId = parseInt(rawProjectId, 10);

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid user' });
  }
  if (isNaN(projectId) || projectId <= 0) {
    throw new AppError('Invalid project ID', 400);
  }

  const result = await UserManager.getQAsByProject(user, projectId);

  if (!result || result.data.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No QAs found',
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'QAs retrieved',
    data: result.data,
  });
});
export default {
  getDevelopersByProject,
  getQAsByProject,
};