const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  document_type: {
    type: DataTypes.ENUM('contract', 'policy', 'handbook', 'form', 'certificate', 'resume', 'id_proof', 'other'),
    allowNull: false
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: '1.0'
  },
  is_confidential: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  access_level: {
    type: DataTypes.ENUM('public', 'internal', 'confidential', 'restricted'),
    defaultValue: 'internal'
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'documents',
  timestamps: false
});

module.exports = Document;