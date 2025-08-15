const { AuthorizationError } = require('./errors/CustomError');
const { asyncHandler } = require('./asyncHandler');

// Check if user has required role
const requireRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    if (!roles.includes(req.userRole)) {
      throw new AuthorizationError(`Access denied. Required role: ${roles.join(' or ')}`);
    }

    next();
  });
};

// Admin only access
const requireAdmin = requireRole('admin');

// HR or Admin access
const requireHR = requireRole('hr', 'admin');

// Manager, HR or Admin access
const requireManager = requireRole('manager', 'hr', 'admin');

// Any authenticated user
const requireAuth = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required.');
  }
  next();
});

// Check specific permissions based on resource and action
const checkPermission = (resource, action) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    const userRole = req.userRole;
    const permissions = getPermissions(userRole);

    if (!hasPermission(permissions, resource, action)) {
      throw new AuthorizationError(`Access denied. Insufficient permissions for ${action} on ${resource}.`);
    }

    next();
  });
};

// Define role-based permissions
const getPermissions = (role) => {
  const permissions = {
    admin: {
      users: ['create', 'read', 'update', 'delete'],
      employees: ['create', 'read', 'update', 'delete'],
      departments: ['create', 'read', 'update', 'delete'],
      attendance: ['create', 'read', 'update', 'delete'],
      leaves: ['create', 'read', 'update', 'delete', 'approve', 'reject'],
      payroll: ['create', 'read', 'update', 'delete'],
      performance: ['create', 'read', 'update', 'delete'],
      training: ['create', 'read', 'update', 'delete'],
      documents: ['create', 'read', 'update', 'delete'],
      recruitment: ['create', 'read', 'update', 'delete'],
      onboarding: ['create', 'read', 'update', 'delete'],
      offboarding: ['create', 'read', 'update', 'delete'],
      notifications: ['create', 'read', 'update', 'delete'],
      reports: ['read', 'export']
    },
    hr: {
      users: ['create', 'read', 'update'],
      employees: ['create', 'read', 'update'],
      departments: ['read', 'update'],
      attendance: ['read', 'update'],
      leaves: ['read', 'approve', 'reject'],
      payroll: ['create', 'read', 'update'],
      performance: ['create', 'read', 'update'],
      training: ['create', 'read', 'update'],
      documents: ['create', 'read', 'update'],
      recruitment: ['create', 'read', 'update'],
      onboarding: ['create', 'read', 'update'],
      offboarding: ['create', 'read', 'update'],
      notifications: ['create', 'read'],
      reports: ['read', 'export']
    },
    manager: {
      employees: ['read'], // Only subordinates
      attendance: ['read'], // Only subordinates
      leaves: ['read', 'approve', 'reject'], // Only subordinates
      performance: ['create', 'read', 'update'], // Only subordinates
      training: ['read', 'assign'], // Only subordinates
      documents: ['read'],
      notifications: ['read'],
      reports: ['read'] // Only team reports
    },
    employee: {
      employees: ['read'], // Only own profile
      attendance: ['create', 'read'], // Only own records
      leaves: ['create', 'read'], // Only own requests
      performance: ['read'], // Only own reviews
      training: ['read'], // Only assigned trainings
      documents: ['read'], // Only assigned documents
      notifications: ['read'], // Only own notifications
      profile: ['read', 'update'] // Own profile
    }
  };

  return permissions[role] || {};
};

// Check if user has specific permission
const hasPermission = (permissions, resource, action) => {
  return permissions[resource] && permissions[resource].includes(action);
};

// Department-based access control
const requireSameDepartment = asyncHandler(async (req, res, next) => {
  if (['admin', 'hr'].includes(req.userRole)) {
    return next();
  }

  const targetDepartmentId = req.params.departmentId || req.body.departmentId;
  
  if (req.departmentId?.toString() !== targetDepartmentId?.toString()) {
    throw new AuthorizationError('Access denied. You can only access resources from your department.');
  }

  next();
});

// Manager subordinate access control
const requireSubordinate = asyncHandler(async (req, res, next) => {
  if (['admin', 'hr'].includes(req.userRole)) {
    return next();
  }

  if (req.userRole !== 'manager') {
    throw new AuthorizationError('Access denied. Manager role required.');
  }

  // This would require additional logic to verify if the target employee is a subordinate
  // For now, we'll allow managers to proceed and let the business logic handle it
  next();
});

// Time-based access control (e.g., only during business hours)
const requireBusinessHours = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Skip check for admin
  if (req.userRole === 'admin') {
    return next();
  }

  // Check if it's a weekday (Monday-Friday) and business hours (9 AM - 6 PM)
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
    return next();
  }

  throw new AuthorizationError('Access denied. This action is only allowed during business hours (9 AM - 6 PM, Monday-Friday).');
});

// Rate limiting by role
const getRoleBasedRateLimit = (role) => {
  const limits = {
    admin: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 requests per 15 minutes
    hr: { windowMs: 15 * 60 * 1000, max: 500 },     // 500 requests per 15 minutes
    manager: { windowMs: 15 * 60 * 1000, max: 200 }, // 200 requests per 15 minutes
    employee: { windowMs: 15 * 60 * 1000, max: 100 } // 100 requests per 15 minutes
  };

  return limits[role] || limits.employee;
};

// IP-based access control
const requireAllowedIP = (allowedIPs = []) => {
  return asyncHandler(async (req, res, next) => {
    // Skip check for admin
    if (req.userRole === 'admin') {
      return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      throw new AuthorizationError('Access denied. Your IP address is not allowed.');
    }

    next();
  });
};

module.exports = {
  requireRole,
  requireAdmin,
  requireHR,
  requireManager,
  requireAuth,
  checkPermission,
  requireSameDepartment,
  requireSubordinate,
  requireBusinessHours,
  getRoleBasedRateLimit,
  requireAllowedIP,
  getPermissions,
  hasPermission
};