import { USER } from "../models/user.js";
import {
  hasAtLeastOneField,
  hasOnlyFields,
  hasRequiredFields,
  isGmail,
  isPhone,
  isPlainObject,
  isString,
} from "./helpers.js";

const userFields = new Set(Object.keys(USER));
const editableUserFields = new Set([...userFields].filter((field) => field !== "id"));

const commonUserValidators = [
  {
    isValid: isPlainObject,
    message: "User entity isn't valid",
  },
  {
    isValid: (body) => !("id" in body),
    message: "User id should not be present",
  },
  {
    isValid: (body) => hasOnlyFields(body, userFields),
    message: "User entity has extra fields",
  },
];

const createUserValidators = [
  ...commonUserValidators,
  {
    isValid: (body) => hasRequiredFields(body, editableUserFields),
    message: "User entity to create isn't valid",
  },
  {
    isValid: (body) => isString(body.firstName),
    message: "First name isn't valid",
  },
  {
    isValid: (body) => isString(body.lastName),
    message: "Last name isn't valid",
  },
  {
    isValid: (body) => isGmail(body.email),
    message: "Email isn't valid",
  },
  {
    isValid: (body) => isPhone(body.phone),
    message: "Phone isn't valid",
  },
  {
    isValid: (body) => typeof body.password === "string" && body.password.length >= 3,
    message: "Password isn't valid",
  },
];

const updateUserValidators = [
  ...commonUserValidators,
  {
    isValid: (body) => hasAtLeastOneField(body, editableUserFields),
    message: "User entity to update isn't valid",
  },
  {
    isValid: (body) => body.firstName === undefined || isString(body.firstName),
    message: "First name isn't valid",
  },
  {
    isValid: (body) => body.lastName === undefined || isString(body.lastName),
    message: "Last name isn't valid",
  },
  {
    isValid: (body) => body.email === undefined || isGmail(body.email),
    message: "Email isn't valid",
  },
  {
    isValid: (body) => body.phone === undefined || isPhone(body.phone),
    message: "Phone isn't valid",
  },
  {
    isValid: (body) => body.password === undefined || (typeof body.password === "string" && body.password.length >= 3),
    message: "Password isn't valid",
  },
];

export { createUserValidators, updateUserValidators };
