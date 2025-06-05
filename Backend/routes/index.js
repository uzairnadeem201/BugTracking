import express from 'express';
import SignupRoute from './signuproute.js';
import LoginRoute from './loginroute.js';
import ProjectRoute from './projectroute.js';
import BugRoute from './bugroutes.js';
import UserRoute from './userroute.js';
import Jwt from '../Utils/jwtverification.js';

const router = express.Router();
router.use('/signup',SignupRoute);
router.use('/Login',LoginRoute);
router.use('/projects',Jwt.verifyToken, ProjectRoute);
router.use('/projects',Jwt.verifyToken, BugRoute);
router.use('/projects',Jwt.verifyToken, UserRoute);

export default router;
