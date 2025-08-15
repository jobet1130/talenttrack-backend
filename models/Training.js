const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Training = sequelize.define('Training', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trainer: {
    type: DataTypes.STRING(100),
    allowNull: true
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
  durationHours: {
    type: DataTypes.INTEGER,
    field: 'duration_hours',
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'scheduled',
    validate: {
      isIn: [['scheduled', 'ongoing', 'completed', 'cancelled']]
    }
  }
}, {
  tableName: 'training',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Training;