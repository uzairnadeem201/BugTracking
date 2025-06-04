import express from 'express';
import SignupController from '../Controllers/signupcontroller.js';

const router = express.Router();

router.post('/signup', SignupController.signup);

export default router;