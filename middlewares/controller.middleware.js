const controllerMiddleware = (action) => (req, res, next) => {
  try {
    res.data = action(req);
    next();
  } catch (err) {
    next(err);
  }
};

export { controllerMiddleware };
