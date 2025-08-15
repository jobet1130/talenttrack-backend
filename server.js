require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { logError } = require('./middleware/errorLogger');
const { asyncHandler } = require('./middleware/asyncHandler');
const { NotFoundError } = require('./middleware/errors/CustomError');

// Import database - FIX: Import sequelize and dbManager correctly
const { sequelize, dbManager } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static('uploads'));

// API Routes
const apiRoutes = require('./routes/index');
app.use('/api/v1', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TalentTrack Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API info route
app.get('/api/v1', (res) => {
  res.json({
    message: 'TalentTrack API v1',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Example route using asyncHandler (no try-catch needed)
app.get('/api/v1/test-error', asyncHandler(async (req, res) => {
  // This will automatically be caught by the error handler
  throw new NotFoundError('Test resource');

  res.json({
    message: 'Error',
    
  })
}));

// Handle 404 for undefined routes
app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl}`));
});

// Error handling middleware (must be last)
app.use(logError);  // Log errors first
app.use(errorHandler);  // Then handle them

// Start server - FIX: Use dbManager.authenticate() and sequelize.sync()
const startServer = async () => {
  try {
    // Use dbManager for authentication
    await dbManager.authenticate();
    console.log('✅ Database connected successfully');
    
    // Use sequelize for sync
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test error: http://localhost:${PORT}/api/v1/test-error`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure PostgreSQL is running and credentials are correct');
    process.exit(1);
  }
};

startServer();

module.exports = app;