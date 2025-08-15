const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Onboarding = sequelize.define('Onboarding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    field: 'employee_id',
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
    allowNull: false
  },
  expectedCompletionDate: {
    type: DataTypes.DATEONLY,
    field: 'expected_completion_date',
    allowNull: true
  },
  actualCompletionDate: {
    type: DataTypes.DATEONLY,
    field: 'actual_completion_date',
    allowNull: true
  },
  checklist: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'in_progress', 'completed', 'delayed']]
    }
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    field: 'assigned_to',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'onboarding',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Onboarding;