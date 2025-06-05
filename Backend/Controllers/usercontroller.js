import catchAsync from "../Utils/catchasync.js";
import UserManager from "../Managers/usermanager.js";
import AppError from "../Utils/apperror.js";

class UserController {
  static getDevelopersByProject = catchAsync(async (req, res) => {
    const user = req.user;
    const rawProjectId = req.params.id;
    const projectId = parseInt(rawProjectId, 10);
    const result = await UserManager.getDevelopersByProject(user, projectId);

    if (!result) {
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
}

export default UserController;
