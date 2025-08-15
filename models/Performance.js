const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Performance = sequelize.define('Performance', {
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
  reviewerId: {
    type: DataTypes.INTEGER,
    field: 'reviewer_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewPeriodStart: {
    type: DataTypes.DATEONLY,
    field: 'review_period_start',
    allowNull: false
  },
  reviewPeriodEnd: {
    type: DataTypes.DATEONLY,
    field: 'review_period_end',
    allowNull: false
  },
  overallRating: {
    type: DataTypes.DECIMAL(3, 2),
    field: 'overall_rating',
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  goals: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  achievements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  areasForImprovement: {
    type: DataTypes.TEXT,
    field: 'areas_for_improvement',
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'draft',
    validate: {
      isIn: [['draft', 'in_progress', 'completed', 'approved']]
    }
  }
}, {
  tableName: 'performance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Performance;