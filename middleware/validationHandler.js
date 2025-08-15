const { ValidationError } = require('./errors/CustomError');

// Express-validator error handler
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new ValidationError(firstError.msg, firstError.param);
  }
  
  next();
};

const validateRequest = (schema) => {
  return (req, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message, error.details[0].path[0]);
    }
    next();
  };
};

module.exports = { handleValidationErrors, validateRequest };