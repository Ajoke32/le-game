const createHttpError = (err) => {
  const message = err.message || "Request error";
  const status = message.toLowerCase().includes("not found") ? 404 : 400;

  return { status, message };
};

const errorHandlingMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const httpError = createHttpError(err);

  return res.status(httpError.status).json({
    error: true,
    message: httpError.message,
  });
};

export { errorHandlingMiddleware };
