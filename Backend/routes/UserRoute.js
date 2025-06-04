import express from 'express';
import UserController from '../Controllers/UserController.js';

const router = express.Router();

router.get('/projects/:id/developers', UserController.getDevelopersByProject);
router.get('/project/:id/qa', UserController.getQAsByProject);

export default router;