/*
 * Sign-up form validation — pure functions, no DOM access.
 * Contract: specs/001-intro-signup-form/contracts/validation-contract.md
 * Exposed as CommonJS (Node tests) or window.SignupValidation (browser).
 */
(function (root) {
  'use strict';

  var FIELD_LABELS = Object.freeze({
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    password: 'Password',
  });

  var FIELD_ORDER = ['firstName', 'lastName', 'email', 'password'];
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var INVALID_EMAIL_MESSAGE = 'Looks like this is not an email';

  function normalize(value) {
    return value == null ? '' : String(value).trim();
  }

  function isValidEmail(value) {
    return EMAIL_PATTERN.test(normalize(value));
  }

  function validateSignup(values) {
    var input = values || {};
    var errors = {};

    FIELD_ORDER.forEach(function (field) {
      var value = normalize(input[field]);

      if (value === '') {
        errors[field] = { code: 'empty', message: FIELD_LABELS[field] + ' cannot be empty' };
      } else if (field === 'email' && !isValidEmail(value)) {
        errors[field] = { code: 'invalidEmail', message: INVALID_EMAIL_MESSAGE };
      }
    });

    return { isValid: Object.keys(errors).length === 0, errors: errors };
  }

  var api = {
    FIELD_LABELS: FIELD_LABELS,
    FIELD_ORDER: FIELD_ORDER,
    isValidEmail: isValidEmail,
    validateSignup: validateSignup,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SignupValidation = api;
  }
})(typeof window !== 'undefined' ? window : this);
