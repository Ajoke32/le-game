import { runValidators } from "../validation/helpers.js";
import { createUserValidators, updateUserValidators } from "../validation/user.js";

const validate = (validators) => (req, res, next) => {
  const message = runValidators(req.body, validators);

  if (message) {
    return next(new Error(message));
  }

  return next();
};

const createUserValid = validate(createUserValidators);
const updateUserValid = validate(updateUserValidators);

export { createUserValid, updateUserValid };
