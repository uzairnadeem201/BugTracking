import catchAsync from '../Utils/CatchAsync.js';
import SignupManager from '../Managers/SignupManager.js';

const signup = catchAsync(async (req, res, next) => {
  if (!req.body){
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
    });
  }
  const result = await SignupManager.signup(req.body);
  if (!result.success) {
    return res.status(result.error.statusCode).json({
      success: false,
      message: result.error.message,
    });
  }
  res.status(201).json(result);
});

export default { signup };


