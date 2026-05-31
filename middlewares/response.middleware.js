const responseMiddleware = (req, res, next) => {
  if (res.data === undefined) {
    return next();
  }

  return res.status(200).json(res.data);
};

export { responseMiddleware };
