const fs = require('fs').promises;
const path = require('path');

class ErrorLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDir();
  }

  async ensureLogDir() {
    try {
      await fs.access(this.logDir);
    } catch {
      await fs.mkdir(this.logDir, { recursive: true });
    }
  }

  async log(error, req = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        errorCode: error.errorCode
      },
      request: req ? {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip
      } : null
    };

    const logFile = path.join(this.logDir, `error-${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(logEntry) + '\n';

    try {
      await fs.appendFile(logFile, logLine);
    } catch (writeError) {
      console.error('Failed to write to log file:', writeError);
    }
  }
}

const errorLogger = new ErrorLogger();

// Middleware to log errors
const logError = (err, req, res, next) => {
  errorLogger.log(err, req);
  next(err);
};

module.exports = { errorLogger, logError };