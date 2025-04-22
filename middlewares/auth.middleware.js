import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';



const authorize = async (req, res, next) => {
  try {
    let accessToken;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      accessToken = req.headers.authorization.split(' ')[1];
    }

    if(!accessToken) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(accessToken, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if(!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}

export default authorize;



export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};