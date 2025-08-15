const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkIn: {
    type: DataTypes.DATE,
    field: 'check_in',
    allowNull: true
  },
  checkOut: {
    type: DataTypes.DATE,
    field: 'check_out',
    allowNull: true
  },
  breakStart: {
    type: DataTypes.DATE,
    field: 'break_start',
    allowNull: true
  },
  breakEnd: {
    type: DataTypes.DATE,
    field: 'break_end',
    allowNull: true
  },
  hoursWorked: {
    type: DataTypes.DECIMAL(4, 2),
    field: 'hours_worked',
    allowNull: true
  },
  overtimeHours: {
    type: DataTypes.DECIMAL(4, 2),
    field: 'overtime_hours',
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'present',
    validate: {
      isIn: [['present', 'absent', 'late', 'half_day', 'holiday']]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['employee_id', 'date']
    }
  ]
});

module.exports = Attendance;