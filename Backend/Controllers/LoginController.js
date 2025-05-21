import catchAsync from '../Utils/CatchAsync.js';
import LoginManager from '../Managers/LoginManager.js';

const login = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
    });
  }

  const result = await LoginManager.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    ...result,
  });
});

export default { login };
