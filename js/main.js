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

  var SUCCESS_MESSAGE = 'Thanks! Your free trial has been claimed.';

  // #form-status is visually hidden (the design shows no summary box), so it
  // holds plain text only: no links, nothing that can take focus unseen.
  function clearStatus(statusEl) {
    statusEl.textContent = '';
  }

  function showErrorSummary(statusEl, invalidFields) {
    var title = document.createElement('p');
    title.textContent = invalidFields.length === 1
      ? 'There is 1 error in the form:'
      : 'There are ' + invalidFields.length + ' errors in the form:';

    var list = document.createElement('ul');
    invalidFields.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item.message;
      list.appendChild(li);
    });

    statusEl.appendChild(title);
    statusEl.appendChild(list);
  }

  function showSuccess(statusEl) {
    var message = document.createElement('p');
    message.textContent = SUCCESS_MESSAGE;
    statusEl.appendChild(message);
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
    var invalidFields = [];
    var statusEl = document.getElementById('form-status');

    // Re-render every field and the status on each submit so repeated clicks
    // never stack state. Clearing first lets the live region re-announce.
    clearStatus(statusEl);
    fields.forEach(function (input) {
      var error = result.errors[input.name];
      if (error) {
        showFieldError(input, error.message);
        invalidFields.push({ input: input, message: error.message });
      } else {
        clearFieldError(input);
      }
    });

    if (invalidFields.length) {
      showErrorSummary(statusEl, invalidFields);
      invalidFields[0].input.focus();
      return;
    }

    form.reset();
    showSuccess(statusEl);
    fields[0].focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('signup-form');
    if (form) form.addEventListener('submit', handleSubmit);
  });
})();
