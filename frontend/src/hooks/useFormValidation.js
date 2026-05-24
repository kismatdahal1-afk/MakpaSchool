import { useState } from "react";

const checks = {
  required: (value) => (value ? "" : "This field is required."),
  email: (value) =>
    /\S+@\S+\.\S+/.test(value || "") ? "" : "Please enter a valid email address.",
  min6: (value) =>
    String(value || "").length >= 6 ? "" : "This field must be at least 6 characters.",
  number: (value) =>
    value === "" || value === null || Number.isNaN(Number(value)) ? "Please enter a valid number." : "",
};

const runRules = (value, rules = []) => {
  for (const rule of rules) {
    if (typeof rule === "function") {
      const customMessage = rule(value);
      if (customMessage) return customMessage;
      continue;
    }

    const checker = checks[rule];
    if (!checker) continue;

    const errorMessage = checker(value);
    if (errorMessage) return errorMessage;
  }
  return "";
};

export const useFormValidation = (initialValues, schema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (schema[name]) {
      const error = runRules(value, schema[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateAll = () => {
    const nextErrors = {};

    for (const key of Object.keys(schema)) {
      nextErrors[key] = runRules(values[key], schema[key]);
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((error) => !error);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    handleChange,
    validateAll,
    reset,
  };
};
