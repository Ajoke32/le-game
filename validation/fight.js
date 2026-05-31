import { FIGHT } from "../models/fight.js";
import {
  hasOnlyFields,
  hasRequiredFields,
  isPlainObject,
  isString,
} from "./helpers.js";

const fightFields = new Set(Object.keys(FIGHT).filter((field) => field !== "id" && field !== "log"));

const createFightValidators = [
  {
    isValid: isPlainObject,
    message: "Fight entity isn't valid",
  },
  {
    isValid: (body) => hasOnlyFields(body, fightFields),
    message: "Fight entity has extra fields",
  },
  {
    isValid: (body) => hasRequiredFields(body, fightFields),
    message: "Fight entity to create isn't valid",
  },
  {
    isValid: (body) => isString(body.fighter1),
    message: "First fighter isn't valid",
  },
  {
    isValid: (body) => isString(body.fighter2),
    message: "Second fighter isn't valid",
  },
  {
    isValid: (body) => body.fighter1 !== body.fighter2,
    message: "Fighters should be different",
  },
];

export { createFightValidators };
