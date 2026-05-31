import { runValidators } from "../validation/helpers.js";
import { createFightValidators } from "../validation/fight.js";

const createFightValid = (req, res, next) => {
  const message = runValidators(req.body, createFightValidators);

  if (message) {
    return next(new Error(message));
  }

  return next();
};

export { createFightValid };
