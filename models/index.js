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

// Define associations
// User - Employee (One-to-One)
User.hasOne(Employee, { foreignKey: 'userId', as: 'employeeProfile' });
Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Department - Employee (One-to-Many)
Department.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });
Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Employee - Manager (Self-referencing)
Employee.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'managerId', as: 'subordinates' });

// Employee - Attendance (One-to-Many)
Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendanceRecords' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Employee - Leave (One-to-Many)
Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaveRequests' });
Leave.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Leave - Approver (Many-to-One)
Leave.belongsTo(Employee, { foreignKey: 'approverId', as: 'approver' });
Employee.hasMany(Leave, { foreignKey: 'approverId', as: 'approvedLeaves' });

// Employee - Payroll (One-to-Many)
Employee.hasMany(Payroll, { foreignKey: 'employeeId', as: 'payrollRecords' });
Payroll.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Employee - Performance (One-to-Many)
Employee.hasMany(Performance, { foreignKey: 'employeeId', as: 'performanceReviews' });
Performance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Performance - Reviewer (Many-to-One)
Performance.belongsTo(Employee, { foreignKey: 'reviewerId', as: 'reviewer' });
Employee.hasMany(Performance, { foreignKey: 'reviewerId', as: 'conductedReviews' });

// Training - Employee (Many-to-Many)
const TrainingParticipant = sequelize.define('TrainingParticipant', {
  enrollmentDate: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  completionDate: {
    type: sequelize.Sequelize.DATE,
    allowNull: true
  },
  status: {
    type: sequelize.Sequelize.ENUM('enrolled', 'in-progress', 'completed', 'dropped'),
    defaultValue: 'enrolled'
  },
  score: {
    type: sequelize.Sequelize.DECIMAL(5, 2),
    allowNull: true
  },
  feedback: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'training_participants',
  timestamps: true
});

Training.belongsToMany(Employee, {
  through: TrainingParticipant,
  foreignKey: 'trainingId',
  otherKey: 'employeeId',
  as: 'participants'
});
Employee.belongsToMany(Training, {
  through: TrainingParticipant,
  foreignKey: 'employeeId',
  otherKey: 'trainingId',
  as: 'trainings'
});

// Document - Employee (Many-to-Many)
const EmployeeDocument = sequelize.define('EmployeeDocument', {
  accessLevel: {
    type: sequelize.Sequelize.ENUM('read', 'write', 'admin'),
    defaultValue: 'read'
  },
  assignedDate: {
    type: sequelize.Sequelize.DATE,
    defaultValue: sequelize.Sequelize.NOW
  },
  acknowledgedDate: {
    type: sequelize.Sequelize.DATE,
    allowNull: true
  },
  isAcknowledged: {
    type: sequelize.Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'employee_documents',
  timestamps: true
});

Document.belongsToMany(Employee, {
  through: EmployeeDocument,
  foreignKey: 'documentId',
  otherKey: 'employeeId',
  as: 'assignedEmployees'
});
Employee.belongsToMany(Document, {
  through: EmployeeDocument,
  foreignKey: 'employeeId',
  otherKey: 'documentId',
  as: 'documents'
});

// Recruitment - Department (Many-to-One)
Recruitment.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Recruitment, { foreignKey: 'departmentId', as: 'openPositions' });

// Recruitment - Hiring Manager (Many-to-One)
Recruitment.belongsTo(Employee, { foreignKey: 'hiringManagerId', as: 'hiringManager' });
Employee.hasMany(Recruitment, { foreignKey: 'hiringManagerId', as: 'managedRecruitments' });

// Employee - Onboarding (One-to-One)
Employee.hasOne(Onboarding, { foreignKey: 'employeeId', as: 'onboarding' });
Onboarding.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Onboarding - Buddy (Many-to-One)
Onboarding.belongsTo(Employee, { foreignKey: 'buddyId', as: 'buddy' });
Employee.hasMany(Onboarding, { foreignKey: 'buddyId', as: 'mentoredOnboardings' });

// Employee - Offboarding (One-to-One)
Employee.hasOne(Offboarding, { foreignKey: 'employeeId', as: 'offboarding' });
Offboarding.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });

// Offboarding - HR Representative (Many-to-One)
Offboarding.belongsTo(Employee, { foreignKey: 'hrRepresentativeId', as: 'hrRepresentative' });
Employee.hasMany(Offboarding, { foreignKey: 'hrRepresentativeId', as: 'managedOffboardings' });

// User - Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Notification - Sender (Many-to-One)
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications' });

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