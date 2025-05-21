import express from 'express';
import cors from 'cors';
import SignupRoute from './Routes/SignupRoute.js';
import LoginRoute from './Routes/LoginRoute.js';
import ProjectRoute from './Routes/ProjectRoute.js';
import Jwt from './Utils/JwtVerification.js';
import BugRoute from './Routes/BugRoutes.js';
import JwtVerification from './Utils/JwtVerification.js';
import UserRoute from './Routes/UserRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use('/api', SignupRoute);
app.use('/api', LoginRoute);
app.use('/api',Jwt.verifyToken,ProjectRoute);
app.use('/api', Jwt.verifyToken, BugRoute);
app.use('/api',Jwt.verifyToken,UserRoute);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
