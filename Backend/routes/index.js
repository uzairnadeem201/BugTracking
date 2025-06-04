import express from 'express';
import SignupRoute from './SignupRoute.js';
import LoginRoute from './LoginRoute.js';
import ProjectRoute from './ProjectRoute.js';
import BugRoute from './BugRoutes.js';
import UserRoute from './UserRoute.js';
import Jwt from '../Utils/JwtVerification.js';

const router = express.Router();
router.use(SignupRoute);
router.use(LoginRoute);
router.use(Jwt.verifyToken, ProjectRoute);
router.use(Jwt.verifyToken, BugRoute);
router.use(Jwt.verifyToken, UserRoute);

export default router;
