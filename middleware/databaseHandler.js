const { DatabaseError, NotFoundError } = require('./errors/CustomError');

// Database operation wrapper
const dbHandler = {
  // Find operations
  findById: async (model, id, options = {}) => {
    const result = await model.findByPk(id, options);
    if (!result) {
      throw new NotFoundError(`${model.name} with ID ${id}`);
    }
    return result;
  },

  // Find one operation
  findOne: async (model, where, options = {}) => {
    const result = await model.findOne({ where, ...options });
    if (!result) {
      throw new NotFoundError(model.name);
    }
    return result;
  },

  // Create operation
  create: async (model, data) => {
    try {
      return await model.create(data);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new DatabaseError('Record already exists', error);
      }
      throw new DatabaseError('Failed to create record', error);
    }
  },

  // Update operation
  update: async (model, id, data) => {
    const record = await dbHandler.findById(model, id);
    try {
      return await record.update(data);
    } catch (error) {
      throw new DatabaseError('Failed to update record', error);
    }
  },

  // Delete operation
  delete: async (model, id) => {
    const record = await dbHandler.findById(model, id);
    try {
      await record.destroy();
      return { message: 'Record deleted successfully' };
    } catch (error) {
      throw new DatabaseError('Failed to delete record', error);
    }
  }
};

module.exports = dbHandler;