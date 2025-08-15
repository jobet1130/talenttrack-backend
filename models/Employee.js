const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.STRING(20),
    field: 'employee_id',
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    field: 'first_name',
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    field: 'last_name',
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    field: 'date_of_birth',
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['male', 'female', 'other']]
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  departmentId: {
    type: DataTypes.INTEGER,
    field: 'department_id',
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  managerId: {
    type: DataTypes.INTEGER,
    field: 'manager_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  hireDate: {
    type: DataTypes.DATE,
    field: 'hire_date',
    allowNull: false
  },
  terminationDate: {
    type: DataTypes.DATE,
    field: 'termination_date',
    allowNull: true
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  employmentType: {
    type: DataTypes.STRING(20),
    field: 'employment_type',
    allowNull: false,
    defaultValue: 'full_time',
    validate: {
      isIn: [['full_time', 'part_time', 'contract', 'intern']]
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive', 'terminated', 'on_leave']]
    }
  },
  emergencyContactName: {
    type: DataTypes.STRING(100),
    field: 'emergency_contact_name',
    allowNull: true
  },
  emergencyContactPhone: {
    type: DataTypes.STRING(20),
    field: 'emergency_contact_phone',
    allowNull: true
  }
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Employee;