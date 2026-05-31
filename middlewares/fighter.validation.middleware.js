import { runValidators } from "../validation/helpers.js";
import {
  createFighterValidators,
  updateFighterValidators,
} from "../validation/fighter.js";

const validate = (validators) => (req, res, next) => {
  const message = runValidators(req.body, validators);

  if (message) {
    return next(new Error(message));
  }

  return next();
};

const createFighterValid = validate(createFighterValidators);
const updateFighterValid = validate(updateFighterValidators);

export { createFighterValid, updateFighterValid };
