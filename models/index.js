const { sequelize } = require('../config/db');

// Import all models
const User = require('./User');
const Employee = require('./Employee');
const Department = require('./Department');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const Payroll = require('./Payroll');
const Performance = require('./Performance');
const Training = require('./Training');
const Document = require('./Document');
const Recruitment = require('./Recruitment');
const Onboarding = require('./Onboarding');
const Offboarding = require('./Offboarding');
const Notification = require('./Notification');

// Define associations with snake_case foreign keys to match hr-schema

// User - Employee (One-to-One)
User.hasOne(Employee, { foreignKey: 'user_id', as: 'employeeProfile' });
Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Department - Manager (Many-to-One)
Department.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Employee.hasMany(Department, { foreignKey: 'manager_id', as: 'managedDepartments' });

// Department - Employee (One-to-Many)
Department.hasMany(Employee, { foreignKey: 'department_id', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Employee - Manager (Self-referencing)
Employee.belongsTo(Employee, { foreignKey: 'manager_id', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'manager_id', as: 'subordinates' });

// Employee - Attendance (One-to-Many)
Employee.hasMany(Attendance, { foreignKey: 'employee_id', as: 'attendanceRecords' });
Attendance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Employee - Leave (One-to-Many)
Employee.hasMany(Leave, { foreignKey: 'employee_id', as: 'leaveRequests' });
Leave.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Leave - Approver (Many-to-One)
Leave.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });
User.hasMany(Leave, { foreignKey: 'approved_by', as: 'approvedLeaves' });

// Employee - Payroll (One-to-Many)
Employee.hasMany(Payroll, { foreignKey: 'employee_id', as: 'payrollRecords' });
Payroll.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Employee - Performance (One-to-Many)
Employee.hasMany(Performance, { foreignKey: 'employee_id', as: 'performanceReviews' });
Performance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Performance - Reviewer (Many-to-One)
Performance.belongsTo(Employee, { foreignKey: 'reviewer_id', as: 'reviewer' });
Employee.hasMany(Performance, { foreignKey: 'reviewer_id', as: 'conductedReviews' });

// Training - Employee (Many-to-Many)
const TrainingParticipant = sequelize.define('TrainingParticipant', {
  training_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'training',
      key: 'id'
    }
  },
  employee_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  enrollment_date: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  completion_date: {
    type: sequelize.Sequelize.DATE,
    allowNull: true
  },
  status: {
    type: sequelize.Sequelize.ENUM('enrolled', 'in_progress', 'completed', 'dropped'),
    defaultValue: 'enrolled'
  },
  score: {
    type: sequelize.Sequelize.DECIMAL(5, 2),
    allowNull: true
  },
  feedback: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  created_at: {
    type: sequelize.Sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.Sequelize.NOW
  },
  updated_at: {
    type: sequelize.Sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.Sequelize.NOW
  }
}, {
  tableName: 'training_participants',
  timestamps: false
});

Training.belongsToMany(Employee, {
  through: TrainingParticipant,
  foreignKey: 'training_id',
  otherKey: 'employee_id',
  as: 'participants'
});
Employee.belongsToMany(Training, {
  through: TrainingParticipant,
  foreignKey: 'employee_id',
  otherKey: 'training_id',
  as: 'trainings'
});

// Document - Employee (Many-to-Many)
const EmployeeDocument = sequelize.define('EmployeeDocument', {
  employee_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  document_id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'id'
    }
  },
  access_level: {
    type: sequelize.Sequelize.ENUM('read', 'write', 'admin'),
    defaultValue: 'read'
  },
  assigned_date: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  acknowledged_date: {
    type: sequelize.Sequelize.DATE,
    allowNull: true
  },
  is_acknowledged: {
    type: sequelize.Sequelize.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: sequelize.Sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.Sequelize.NOW
  },
  updated_at: {
    type: sequelize.Sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.Sequelize.NOW
  }
}, {
  tableName: 'employee_documents',
  timestamps: false
});

Document.belongsToMany(Employee, {
  through: EmployeeDocument,
  foreignKey: 'document_id',
  otherKey: 'employee_id',
  as: 'assignedEmployees'
});
Employee.belongsToMany(Document, {
  through: EmployeeDocument,
  foreignKey: 'employee_id',
  otherKey: 'document_id',
  as: 'documents'
});

// Recruitment - Department (Many-to-One)
Recruitment.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Department.hasMany(Recruitment, { foreignKey: 'department_id', as: 'openPositions' });

// Employee - Onboarding (One-to-One)
Employee.hasOne(Onboarding, { foreignKey: 'employee_id', as: 'onboarding' });
Onboarding.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Onboarding - Buddy (Many-to-One)
Onboarding.belongsTo(Employee, { foreignKey: 'buddy_id', as: 'buddy' });
Employee.hasMany(Onboarding, { foreignKey: 'buddy_id', as: 'mentoredOnboardings' });

// Employee - Offboarding (One-to-One)
Employee.hasOne(Offboarding, { foreignKey: 'employee_id', as: 'offboarding' });
Offboarding.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// User - Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Export all models
module.exports = {
  sequelize,
  User,
  Employee,
  Department,
  Attendance,
  Leave,
  Payroll,
  Performance,
  Training,
  Document,
  Recruitment,
  Onboarding,
  Offboarding,
  Notification,
  TrainingParticipant,
  EmployeeDocument
};