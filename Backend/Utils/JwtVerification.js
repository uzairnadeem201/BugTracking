import jwt from 'jsonwebtoken';
import AppError from './AppError.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (req,res,next) => {
   try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(new AppError('Not logged in', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
  console.log("MiddleWare Working");
};

export default { signToken, verifyToken };