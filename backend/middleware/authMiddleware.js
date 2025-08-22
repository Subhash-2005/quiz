const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth Middleware - Token received:', token ? 'Yes' : 'No');
    console.log('Auth Middleware - Full Authorization header:', req.header('Authorization'));
    
    if (!token) {
      console.log('Auth Middleware - No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('Auth Middleware - User not found for token');
      return res.status(401).json({ message: 'Token is not valid.' });
    }
    
    console.log('Auth Middleware - User authenticated:', user.username);
    req.user = user;
    next();
  } catch (error) {
    console.log('Auth Middleware - Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, adminMiddleware };
