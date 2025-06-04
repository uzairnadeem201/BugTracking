import express from 'express';
import BugController from '../Controllers/BugController.js';

const router = express.Router();

router.get('/projects/:id/bugs', BugController.getBugsByProject);
router.post('/projects/bugs/createbugs', BugController.createBug);
router.delete('/projects/bugs/delete', BugController.deleteBug);
router.put('/projects/bugs/status', BugController.updateBugStatus);





export default router;