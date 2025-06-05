import express from 'express';
import UserController from '../Controllers/usercontroller.js';

const router = express.Router();

router.get('/:id/developers', UserController.getDevelopersByProject);

export default router;