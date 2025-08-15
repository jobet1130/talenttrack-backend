const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Leave = sequelize.define('Leave', {
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
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['vacation', 'sick', 'personal', 'maternity', 'paternity', 'emergency']]
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date',
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date',
    allowNull: false
  },
  daysRequested: {
    type: DataTypes.INTEGER,
    field: 'days_requested',
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected', 'cancelled']]
    }
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    field: 'approved_by',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    field: 'approved_at',
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    field: 'rejection_reason',
    allowNull: true
  }
}, {
  tableName: 'leaves',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Leave;