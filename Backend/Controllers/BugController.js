import BugManager from '../Managers/BugManager.js';
import catchAsync from '../Utils/CatchAsync.js';
import AppError from '../Utils/AppError.js';

const getBugsByProject = catchAsync(async (req, res) => {
  console.log("Controller");
  const user = req.user;
  const rawProjectId = req.params.id;
  const projectId = parseInt(rawProjectId, 10);
  console.log(projectId)
  console.log(projectId,user);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user',
    });
  }
  if (!projectId) {
    throw new AppError('Invalid or missing project ID.', 400);
  }

  const result = await BugManager.getBugsByProject(user, projectId);

  if (!result || result.data.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No bugs found',
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'Bugs retrieved successfully',
    data: result.data,
  });
});
const createBug = catchAsync(async (req, res) => {
  const user = req.user;              
  const {projectId,bugData} = req.body;

  if (!user || user.role !== 'QA') {
    throw new AppError('Only QA can create bugs', 403);
  }
  const Bug = await BugManager.createBug(user.id, projectId, bugData);

  res.status(201).json({
    success: true,
    message: 'Bug created successfully',
    data: Bug,
  });
});
const updateBugStatus = catchAsync(async (req, res) => {
  const user = req.user;
  const { projectId , bugId , status } = req.body;
  console.log(projectId);

  const result = await BugManager.updateBugStatus(user, projectId,bugId, status);

  res.status(200).json({
    success: true,
    message: 'Bug status updated successfully',
    data: result,
  });
});
const deleteBug = catchAsync(async(req,res)=>{
  const user = req.user;
  const {projectId, bugId} = req.body;
  const result = await BugManager.deleteBug(user,projectId,bugId);
  res.status(200).json({
    success: true,
    message: 'Bug deleted successfully',
    data: result,
  });

});

export default { getBugsByProject, createBug , updateBugStatus,deleteBug };
