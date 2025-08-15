// Base custom error class
class CustomError extends Error {
  constructor(message, statusCode = 500, errorCode = null, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
}

// Specific error types
class ValidationError extends CustomError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.field = field;
  }
}

class AuthenticationError extends CustomError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends CustomError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends CustomError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

class ConflictError extends CustomError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

class DatabaseError extends CustomError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500, 'DATABASE_ERROR');
    this.originalError = originalError;
  }
}

class ExternalServiceError extends CustomError {
  constructor(service, message = 'External service unavailable') {
    super(`${service}: ${message}`, 503, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
  }
}

class RateLimitError extends CustomError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

class FileUploadError extends CustomError {
  constructor(message = 'File upload failed', fileType = null) {
    super(message, 400, 'FILE_UPLOAD_ERROR');
    this.fileType = fileType;
  }
}

class PaymentError extends CustomError {
  constructor(message = 'Payment processing failed', paymentMethod = null) {
    super(message, 402, 'PAYMENT_ERROR');
    this.paymentMethod = paymentMethod;
  }
}

class BusinessLogicError extends CustomError {
  constructor(message, operation = null) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR');
    this.operation = operation;
  }
}

class TokenError extends CustomError {
  constructor(message = 'Invalid or expired token') {
    super(message, 401, 'TOKEN_ERROR');
  }
}

class EmailError extends CustomError {
  constructor(message = 'Email service error') {
    super(message, 503, 'EMAIL_ERROR');
  }
}

class SkillMatchError extends CustomError {
  constructor(message = 'Skill matching failed') {
    super(message, 422, 'SKILL_MATCH_ERROR');
  }
}

class ApplicationStatusError extends CustomError {
  constructor(message = 'Invalid application status transition') {
    super(message, 422, 'APPLICATION_STATUS_ERROR');
  }
}

module.exports = {
  CustomError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  FileUploadError,
  PaymentError,
  BusinessLogicError,
  TokenError,
  EmailError,
  SkillMatchError,
  ApplicationStatusError
};