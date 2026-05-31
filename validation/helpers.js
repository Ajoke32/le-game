const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const hasValue = (value) => {
  return value !== undefined && value !== null && value !== "";
};

const isString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isNumberInRange = (value, min, max) => {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
};

const hasOnlyFields = (body, allowedFields) => {
  return Object.keys(body).every((field) => allowedFields.has(field));
};

const hasRequiredFields = (body, requiredFields) => {
  return [...requiredFields].every((field) => hasValue(body[field]));
};

const hasAtLeastOneField = (body, fields) => {
  return Object.keys(body).some((field) => fields.has(field));
};

const isGmail = (email) => {
  return /^[^\s@]+@gmail\.com$/i.test(email);
};

const isPhone = (phone) => {
  return /^\+380\d{9}$/.test(phone);
};

const runValidators = (body, validators) => {
  const failedValidator = validators.find((validator) => !validator.isValid(body));
  return failedValidator?.message ?? null;
};

export {
  hasAtLeastOneField,
  hasOnlyFields,
  hasRequiredFields,
  isGmail,
  isNumberInRange,
  isPhone,
  isPlainObject,
  isString,
  runValidators,
};
