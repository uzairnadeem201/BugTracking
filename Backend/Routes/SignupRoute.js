import express from 'express';
import SignupController from '../Controllers/SignupController.js';

const router = express.Router();

router.post('/signup', SignupController.signup);

export default router;