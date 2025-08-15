const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Offboarding = sequelize.define('Offboarding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  resignation_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_working_day: {
    type: DataTypes.DATE,
    allowNull: false
  },
  reason: {
    type: DataTypes.ENUM('resignation', 'termination', 'retirement', 'contract_end', 'layoff'),
    allowNull: false
  },
  reason_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notice_period: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('initiated', 'in_progress', 'completed'),
    defaultValue: 'initiated'
  },
  checklist: {
    type: DataTypes.JSON,
    allowNull: true
  },
  completed_tasks: {
    type: DataTypes.JSON,
    allowNull: true
  },
  equipment_returned: {
    type: DataTypes.JSON,
    allowNull: true
  },
  access_revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  final_settlement: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  exit_interview_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  exit_interview_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  handover_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  clearance_status: {
    type: DataTypes.ENUM('pending', 'partial', 'complete'),
    defaultValue: 'pending'
  },
  completion_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'offboarding',
  timestamps: false
});

module.exports = Offboarding;