const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AuthenticationError, TokenError } = require('./errors/CustomError');
const { asyncHandler } = require('./asyncHandler');

// Verify JWT token and authenticate user
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies (if using cookie-based auth)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    throw new AuthenticationError('Access denied. No token provided.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findByPk(decoded.id, {
      include: [{
        model: require('../models/Employee'),
        as: 'employeeProfile',
        include: [{
          model: require('../models/Department'),
          as: 'department'
        }]
      }]
    });

    if (!user) {
      throw new AuthenticationError('Invalid token. User not found.');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated.');
    }

    // Check if account is locked
    if (user.isLocked && user.isLocked()) {
      throw new AuthenticationError('Account is temporarily locked.');
    }

    // Add user to request object
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;
    
    // Add employee info if available
    if (user.employeeProfile) {
      req.employee = user.employeeProfile;
      req.employeeId = user.employeeProfile.id;
      req.departmentId = user.employeeProfile.departmentId;
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new TokenError('Invalid token.');
    } else if (error.name === 'TokenExpiredError') {
      throw new TokenError('Token expired.');
    } else if (error.name === 'NotBeforeError') {
      throw new TokenError('Token not active.');
    }
    throw error;
  }
});

// Optional authentication (doesn't throw error if no token)
const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    console.log(error)
    next();
  }
});

// Generate JWT token
const generateToken = (userId, role = 'employee') => {
  return jwt.sign(
    { 
      id: userId, 
      role: role,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'talenttrack-api',
      audience: 'talenttrack-client'
    }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      issuer: 'talenttrack-api',
      audience: 'talenttrack-client'
    }
  );
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new TokenError('Invalid refresh token type.');
    }
    return decoded;
  } catch (error) {
    console.log(error)
    throw new TokenError('Invalid refresh token.');
  }
};

// Middleware to check if user owns the resource or has permission
const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return asyncHandler(async (req, res, next) => {
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    // Admin and HR can access any resource
    if (['admin', 'hr'].includes(req.userRole)) {
      return next();
    }
    
    // Managers can access their subordinates' resources
    if (req.userRole === 'manager' && req.employee) {
      // This would require additional logic to check if the resource belongs to a subordinate
      // For now, we'll allow managers to proceed and let the business logic handle it
      return next();
    }
    
    // Users can only access their own resources
    if (req.userId.toString() === resourceUserId?.toString()) {
      return next();
    }
    
    throw new AuthenticationError('Access denied. You can only access your own resources.');
  });
};

// Middleware to check employee ownership
const checkEmployeeOwnership = (employeeIdField = 'employeeId') => {
  return asyncHandler(async (req, res, next) => {
    const resourceEmployeeId = req.params[employeeIdField] || req.body[employeeIdField];
    
    // Admin and HR can access any employee resource
    if (['admin', 'hr'].includes(req.userRole)) {
      return next();
    }
    
    // Users can only access their own employee resources
    if (req.employeeId?.toString() === resourceEmployeeId?.toString()) {
      return next();
    }
    
    throw new AuthenticationError('Access denied. You can only access your own employee data.');
  });
};

module.exports = {
  authenticate,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  checkResourceOwnership,
  checkEmployeeOwnership
};