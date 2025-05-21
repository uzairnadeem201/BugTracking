import express from 'express';
import LoginController from '../Controllers/LoginController.js';

const router = express.Router();

router.post('/Login', LoginController.login);

export default router;