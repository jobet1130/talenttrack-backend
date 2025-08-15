const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Alternative syntax for class methods
const asyncMethod = ( descriptor) => {
  const method = descriptor.value;
  descriptor.value = function (...args) {
    const result = method.apply(this, args);
    if (result && typeof result.catch === 'function') {
      return result.catch(args[args.length - 1]); // next function
    }
    return result;
  };
  return descriptor;
};

module.exports = { asyncHandler, asyncMethod };