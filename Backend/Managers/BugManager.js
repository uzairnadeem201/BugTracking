import BugHandler from '../Handlers/BugHandler.js';
import AppError from '../Utils/AppError.js';

const getBugsByProject = async (user, projectId) => {
  const { id: userId, role } = user;
  console.log(userId,role,projectId);

  if (!userId || !role) {
    throw new AppError('Invalid User data.', 400);
  }

  let bugs;

  if (role === 'Manager') {
    bugs = await BugHandler.getBugsByManager(userId, projectId);
  } else if (role === 'QA') {
    console.log(projectId);
    bugs = await BugHandler.getBugsByQA(userId, projectId);
  } else if (role === 'Developer') {
    bugs = await BugHandler.getBugsByDeveloper(userId, projectId);
  } else {
    throw new AppError('Invalid role', 403);
  }

  return { data: bugs };
};
const createBug = async (userId, projectId, bugData) => {
  const isAssigned = await BugHandler.isProjectAssignedToUser(userId, projectId);
  if (!isAssigned) {
    throw new AppError('You are not assigned to this project', 403);
  }
  const bug = {
    ...bugData,
    project_id: projectId,
    created_by: userId,
  };

  const createdBug = await BugHandler.createBug(bug);

  return createdBug;
};
const updateBugStatus = async (user, projectId, bugId, status) => {
  const { id: userId, role } = user;

  if (role !== 'Developer') {
    throw new AppError('Only developers can update bug status', 403);
  }

  const isAssigned = await BugHandler.isUserAssignedToProject(userId, projectId);
  if (!isAssigned) {
    throw new AppError('You are not assigned to this project', 403);
  }

  const updatedBug = await BugHandler.updateBugStatus(userId, projectId, bugId, status);
  if (!updatedBug) {
    throw new AppError('Failed to update bug', 400);
  }

  return updatedBug;
};
const deleteBug = async(user,projectId,bugId) =>{
  const {id: userId , role} = user;
  if (role !== 'QA') {
    throw new AppError('Only QA can delete bug', 403);
  }

  const isAssigned = await BugHandler.isUserAssignedToProject(userId, projectId);
  if (!isAssigned) {
    throw new AppError('You are not assigned to this project', 403);
  }
  const deletedBug = await BugHandler.deleteBug(userId, projectId, bugId);
  if (!deleteBug) {
    throw new AppError('Failed to delete bug', 400);
  }
  return deletedBug;

};

export default { getBugsByProject,createBug,updateBugStatus,deleteBug };
