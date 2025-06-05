import express from 'express';
import ProjectController from '../Controllers/projectcontroller.js';

const router = express.Router();

router.get( '/',ProjectController.getProjects);
router.get('/:id',ProjectController.getOneProject);
router.post('/',ProjectController.createProject);



export default router;