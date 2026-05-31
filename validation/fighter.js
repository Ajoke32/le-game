import { FIGHTER } from "../models/fighter.js";
import {
  hasAtLeastOneField,
  hasOnlyFields,
  hasRequiredFields,
  isNumberInRange,
  isPlainObject,
  isString,
} from "./helpers.js";

const fighterFields = new Set(Object.keys(FIGHTER));
const editableFighterFields = new Set([...fighterFields].filter((field) => field !== "id"));
const requiredFighterFields = new Set([...editableFighterFields].filter((field) => field !== "health"));

const commonFighterValidators = [
  {
    isValid: isPlainObject,
    message: "Fighter entity isn't valid",
  },
  {
    isValid: (body) => !("id" in body),
    message: "Fighter id should not be present",
  },
  {
    isValid: (body) => hasOnlyFields(body, fighterFields),
    message: "Fighter entity has extra fields",
  },
];

const createFighterValidators = [
  ...commonFighterValidators,
  {
    isValid: (body) => hasRequiredFields(body, requiredFighterFields),
    message: "Fighter entity to create isn't valid",
  },
  {
    isValid: (body) => isString(body.name),
    message: "Fighter name isn't valid",
  },
  {
    isValid: (body) => isNumberInRange(body.power, 1, 100),
    message: "Fighter power isn't valid",
  },
  {
    isValid: (body) => isNumberInRange(body.defense, 1, 10),
    message: "Fighter defense isn't valid",
  },
  {
    isValid: (body) => body.health === undefined || isNumberInRange(body.health, 80, 120),
    message: "Fighter health isn't valid",
  },
];

const updateFighterValidators = [
  ...commonFighterValidators,
  {
    isValid: (body) => hasAtLeastOneField(body, editableFighterFields),
    message: "Fighter entity to update isn't valid",
  },
  {
    isValid: (body) => body.name === undefined || isString(body.name),
    message: "Fighter name isn't valid",
  },
  {
    isValid: (body) => body.power === undefined || isNumberInRange(body.power, 1, 100),
    message: "Fighter power isn't valid",
  },
  {
    isValid: (body) => body.defense === undefined || isNumberInRange(body.defense, 1, 10),
    message: "Fighter defense isn't valid",
  },
  {
    isValid: (body) => body.health === undefined || isNumberInRange(body.health, 80, 120),
    message: "Fighter health isn't valid",
  },
];

export { createFighterValidators, updateFighterValidators };
