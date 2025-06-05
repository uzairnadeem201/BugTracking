import express from 'express';
import LoginController from '../Controllers/logincontroller.js';

const router = express.Router();

router.post('/', LoginController.login);

export default router;