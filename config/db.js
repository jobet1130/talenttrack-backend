require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DatabaseError } = require('../middleware/errors/CustomError');
const { errorLogger } = require('../middleware/errorLogger');

// Create Sequelize instance with custom error handling
const sequelize = new Sequelize(
  process.env.DB_NAME || 'talenttrack',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: parseInt(process.env.DB_POOL_MIN) || 5,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    retry: {
      max: 3
    },
    dialectOptions: {
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    },
    hooks: {
      beforeConnect: async () => {
        console.log('🔄 Attempting database connection...');
      },
      afterConnect: async () => {
        console.log('✅ Database connection established successfully');
      },
      beforeDisconnect: async () => {
        console.log('🔌 Disconnecting from database...');
      },
      afterDisconnect: async () => {
        console.log('❌ Database connection closed');
      }
    }
  }
);

// Enhanced database connection handler with custom error handling
class DatabaseManager {
  constructor(sequelizeInstance) {
    this.sequelize = sequelizeInstance;
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
  }

  async authenticate() {
    try {
      await this.sequelize.authenticate();
      this.isConnected = true;
      this.connectionRetries = 0;
      console.log('✅ Database authentication successful');
      return true;
    } catch (error) {
      this.isConnected = false;
      await this.handleConnectionError(error);
    }
  }

  async handleConnectionError(error) {
    this.connectionRetries++;
    await errorLogger.log(error);
    
    let customError;
    
    if (error.name === 'SequelizeConnectionError') {
      customError = new DatabaseError(
        `Failed to connect to database: ${error.message}`,
        error
      );
    } else if (error.name === 'SequelizeConnectionRefusedError') {
      customError = new DatabaseError(
        'Database connection refused. Please check if the database server is running.',
        error
      );
    } else if (error.name === 'SequelizeHostNotFoundError') {
      customError = new DatabaseError(
        'Database host not found. Please check your database configuration.',
        error
      );
    } else if (error.name === 'SequelizeAccessDeniedError') {
      customError = new DatabaseError(
        'Database access denied. Please check your credentials.',
        error
      );
    } else if (error.name === 'SequelizeInvalidConnectionError') {
      customError = new DatabaseError(
        'Invalid database connection parameters.',
        error
      );
    } else {
      customError = new DatabaseError(
        'Unknown database connection error occurred.',
        error
      );
    }

    if (this.connectionRetries < this.maxRetries) {
      console.log(`⚠️  Database connection failed. Retrying... (${this.connectionRetries}/${this.maxRetries})`);
      
      const delay = Math.min(1000 * Math.pow(2, this.connectionRetries - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.authenticate();
    } else {
      console.error('❌ Max database connection retries exceeded');
      throw customError;
    }
  }

  async sync(options = {}) {
    try {
      if (!this.isConnected) {
        await this.authenticate();
      }
      
      const syncOptions = {
        alter: process.env.NODE_ENV === 'development',
        force: false,
        ...options
      };
      
      await this.sequelize.sync(syncOptions);
      console.log('✅ Database synchronized successfully');
      return true;
    } catch (error) {
      await errorLogger.log(error);
      
      if (error.name === 'SequelizeDatabaseError') {
        throw new DatabaseError(
          `Database synchronization failed: ${error.message}`,
          error
        );
      }
      
      throw new DatabaseError(
        'Failed to synchronize database schema',
        error
      );
    }
  }

  async close() {
    try {
      await this.sequelize.close();
      this.isConnected = false;
      console.log('✅ Database connection closed successfully');
    } catch (error) {
      await errorLogger.log(error);
      throw new DatabaseError('Failed to close database connection', error);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      retries: this.connectionRetries,
      maxRetries: this.maxRetries,
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'talenttrack',
        dialect: process.env.DB_DIALECT || 'postgres'
      }
    };
  }

  async query(sql, options = {}) {
    try {
      if (!this.isConnected) {
        await this.authenticate();
      }
      
      return await this.sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        ...options
      });
    } catch (error) {
      await errorLogger.log(error);
      
      if (error.name === 'SequelizeDatabaseError') {
        throw new DatabaseError(
          `Query execution failed: ${error.message}`,
          error
        );
      }
      
      throw new DatabaseError('Database query failed', error);
    }
  }

  async transaction(callback) {
    const t = await this.sequelize.transaction();
    
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      await errorLogger.log(error);
      
      throw new DatabaseError(
        `Transaction failed: ${error.message}`,
        error
      );
    }
  }
}

const dbManager = new DatabaseManager(sequelize);

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down database connection...');
  try {
    await dbManager.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database shutdown:', error.message);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Received SIGTERM, shutting down database connection...');
  try {
    await dbManager.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database shutdown:', error.message);
    process.exit(1);
  }
});

module.exports = {
  sequelize,
  dbManager,
  authenticate: () => dbManager.authenticate(),
  sync: (options) => dbManager.sync(options),
  close: () => dbManager.close(),
  query: (sql, options) => dbManager.query(sql, options),
  transaction: (callback) => dbManager.transaction(callback),
  getStatus: () => dbManager.getConnectionStatus()
};