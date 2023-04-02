const asyncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (exeption) {
      next(exeption);
    }
  };
};

module.exports = {
  asyncMiddleware,
};
