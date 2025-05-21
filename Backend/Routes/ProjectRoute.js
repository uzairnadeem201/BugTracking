import express from 'express';
import ProjectController from '../Controllers/ProjectController.js';

const router = express.Router();

router.get('/projects', ProjectController.getProjects);
router.get('/projects/:id',ProjectController.getOneProject);
router.post('/projects',ProjectController.createProjects);
router.put('/projects',ProjectController.assignProject);


export default router;