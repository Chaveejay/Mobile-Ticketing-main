// middleware/checkRole.js

const jwt = require('jsonwebtoken');

const checkRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      req.user = decoded; // Attach user data to request object
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = checkRole;
