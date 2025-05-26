import UserManager from '../Managers/UserManager.js';
import catchAsync from '../Utils/CatchAsync.js';
import AppError from '../Utils/AppError.js';

const getDeveloper = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user',
    });
  }
  const result = await UserManager.getDeveloper(user);

  if (!result || result.data.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No User',
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: 'Developers Retrieved',
    data: result.data,
  });
});
const getQA = catchAsync(async (req, res) => {
    const user = req.user;
  
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user',
      });
    }
    const result = await UserManager.getQA(user);
  
    if (!result || result.data.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No QA',
        data: [],
      });
    }
  
    res.status(200).json({
      success: true,
      message: 'QA Retrieved',
      data: result.data,
    });
  });

export default {getDeveloper,getQA};