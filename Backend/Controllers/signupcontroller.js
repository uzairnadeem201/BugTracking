import SignupManager from '../Managers/signupmanager.js';

class SignupController {
  static async signup(req, res, next) {
    try {
      const result = await SignupManager.signup(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error('Signup Error:', err);

      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Signup failed',
      });
    }
  }
}

export default SignupController;



