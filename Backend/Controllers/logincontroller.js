import LoginManager from '../Managers/loginmanager.js';
import LoginConstants from '../constants/loginconstants.js';

class LoginController {
  static async login(req, res, next) {
    try {
      const result = await LoginManager.login(req.body);

      res.status(200).json({
        success: true,
        message: LoginConstants.SUCCESS.LOGIN_SUCCESS,
        ...result,
      });
    } catch (err) {
      console.error('Login Error:', err);

      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || 'Login failed',
      });
    }
  }
}

export default LoginController;



