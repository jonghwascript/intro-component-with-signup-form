const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateSignup, isValidEmail, FIELD_LABELS } = require('../js/validation.js');

const VALID = {
  firstName: 'Jonathan',
  lastName: 'Doe',
  email: 'name@host.tld',
  password: 'secret',
};

test('all fields empty → four "cannot be empty" errors in field order', () => {
  const result = validateSignup({ firstName: '', lastName: '', email: '', password: '' });
  assert.equal(result.isValid, false);
  assert.deepEqual(Object.keys(result.errors), ['firstName', 'lastName', 'email', 'password']);
  assert.deepEqual(result.errors.firstName, { code: 'empty', message: 'First Name cannot be empty' });
  assert.deepEqual(result.errors.lastName, { code: 'empty', message: 'Last Name cannot be empty' });
  assert.deepEqual(result.errors.email, { code: 'empty', message: 'Email Address cannot be empty' });
  assert.deepEqual(result.errors.password, { code: 'empty', message: 'Password cannot be empty' });
});

test('malformed email "email@example/com" → only invalidEmail error', () => {
  const result = validateSignup({ ...VALID, email: 'email@example/com' });
  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, {
    email: { code: 'invalidEmail', message: 'Looks like this is not an email' },
  });
});

test('email without TLD "name@host" → invalidEmail', () => {
  const result = validateSignup({ ...VALID, email: 'name@host' });
  assert.equal(result.errors.email.code, 'invalidEmail');
});

test('email surrounded by spaces is trimmed and valid', () => {
  const result = validateSignup({ ...VALID, email: '  name@host.tld  ' });
  assert.deepEqual(result, { isValid: true, errors: {} });
});

test('whitespace-only first name → empty', () => {
  const result = validateSignup({ ...VALID, firstName: '   ' });
  assert.deepEqual(result.errors, {
    firstName: { code: 'empty', message: 'First Name cannot be empty' },
  });
});

test('empty email reports empty, not invalidEmail', () => {
  const result = validateSignup({ ...VALID, email: '' });
  assert.deepEqual(result.errors.email, { code: 'empty', message: 'Email Address cannot be empty' });
});

test('all valid → isValid true with no errors', () => {
  assert.deepEqual(validateSignup(VALID), { isValid: true, errors: {} });
});

test('missing / null values are treated as empty', () => {
  const result = validateSignup({ firstName: null });
  assert.equal(Object.keys(result.errors).length, 4);
});

test('isValidEmail and FIELD_LABELS follow the contract', () => {
  assert.equal(isValidEmail(' a@b.co '), true);
  assert.equal(isValidEmail('a b@c.d'), false);
  assert.deepEqual(FIELD_LABELS, {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    password: 'Password',
  });
});
