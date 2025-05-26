import express from 'express';
import UserController from '../Controllers/UserController.js';

const router = express.Router();

router.get('/user/developer', UserController.getDeveloper);
router.get('/user/qa',UserController.getQA);



export default router;