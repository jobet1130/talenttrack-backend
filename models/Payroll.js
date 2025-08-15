const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payroll = sequelize.define('Payroll', {
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
  payPeriodStart: {
    type: DataTypes.DATEONLY,
    field: 'pay_period_start',
    allowNull: false
  },
  payPeriodEnd: {
    type: DataTypes.DATEONLY,
    field: 'pay_period_end',
    allowNull: false
  },
  basicSalary: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'basic_salary',
    allowNull: false
  },
  overtimePay: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'overtime_pay',
    defaultValue: 0
  },
  bonus: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  allowances: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  deductions: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  taxDeduction: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'tax_deduction',
    defaultValue: 0
  },
  grossPay: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'gross_pay',
    allowNull: false
  },
  netPay: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'net_pay',
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'processed', 'paid', 'cancelled']]
    }
  },
  processedBy: {
    type: DataTypes.INTEGER,
    field: 'processed_by',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  processedAt: {
    type: DataTypes.DATE,
    field: 'processed_at',
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    field: 'payment_date',
    allowNull: true
  }
}, {
  tableName: 'payroll',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Payroll;