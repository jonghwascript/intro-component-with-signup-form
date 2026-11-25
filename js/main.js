/*
 * Wires the sign-up form to the validation module.
 * Contract: specs/001-intro-signup-form/contracts/ui-contract.md (동작 계약)
 */
(function () {
  'use strict';

  function showFieldError(input, message) {
    var errorEl = document.getElementById(input.id + '-error');
    errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id);
  }

  function clearFieldError(input) {
    var errorEl = document.getElementById(input.id + '-error');
    errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  function handleSubmit(event) {
    event.preventDefault();

    var form = event.currentTarget;
    var validation = window.SignupValidation;
    var fields = validation.FIELD_ORDER.map(function (name) {
      return form.elements[name];
    });

    var values = {};
    fields.forEach(function (input) {
      values[input.name] = input.value;
    });

    var result = validation.validateSignup(values);
    var firstInvalid = null;

    // Re-render every field on each submit so repeated clicks never stack state.
    fields.forEach(function (input) {
      var error = result.errors[input.name];
      if (error) {
        showFieldError(input, error.message);
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearFieldError(input);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    form.reset();
    fields[0].focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('signup-form');
    if (form) form.addEventListener('submit', handleSubmit);
  });
})();
