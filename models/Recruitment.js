const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Recruitment = sequelize.define('Recruitment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'executive'),
    allowNull: false
  },
  employment_type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'temporary', 'intern'),
    allowNull: false
  },
  salary_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  salary_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  remote_allowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'closed', 'filled'),
    defaultValue: 'draft'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  applications_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'recruitment',
  timestamps: false
});

module.exports = Recruitment;