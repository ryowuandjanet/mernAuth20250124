import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          throw new Error('User not found');
        }

        next();
      } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: '未授權的訪問' });
      }
    }

    if (!token) {
      res.status(401).json({ message: '未提供認證令牌' });
    }
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(500).json({ message: '認證過程發生錯誤' });
  }
};
