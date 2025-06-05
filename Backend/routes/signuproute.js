import express from 'express';
import SignupController from '../Controllers/signupcontroller.js';

const router = express.Router();

router.post('/', SignupController.signup);

export default router;