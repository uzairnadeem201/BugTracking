import express from 'express';
import BugController from '../Controllers/bugcontroller.js';

const router = express.Router();

router.get('/:id/bugs', BugController.getBugsByProject);
router.post('/bugs/createbugs', BugController.createBug);
router.delete('/bugs/delete', BugController.deleteBug);
router.put('/bugs/status', BugController.updateBugStatus);

export default router;