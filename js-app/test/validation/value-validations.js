import {validateByRegexp, validateLength, validateSameValue} from '../../validation/value-validations.js';
import {EMAIL_VALIDATION_REGEX} from '../../constants.js';

const {module, test} = QUnit;

module('validateLength', () => {
  [[5, 'hello world'],
    [0, ''],
    [1, 'some text']]
      .forEach(([minLength, testingText]) => {
        test(`Min length: '${minLength}', testing text: '${testingText}'`, function(assert) {
          const validatingFunction = validateLength(minLength, 'Length validation error.');
          validatingFunction(testingText).then(() => {
            assert.ok(true, 'Should resolve promise.');
          });
        });
      });

  [[1, ''],
    [5, '123'],
    [15, 'some text %636']]
      .forEach(([minLength, testingText]) => {
        test(`Min length: '${minLength}', testing text: '${testingText}'`, function(assert) {
          const validatingFunction = validateLength(minLength, 'Length validation error.');
          validatingFunction(testingText).catch((error) => {
            assert.strictEqual(error.message,
                'Length validation error.', 'Should reject with \'Length validation error.\'.');
          },
          );
        });
      });
});

module('validateRegex', function() {
  ['helloWorld',
    'Peter',
    '123']
      .forEach((testingText) => {
        test(`RegExp pattern: '${EMAIL_VALIDATION_REGEX}', testing text: '${testingText}'`, function(assert) {
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Regexp validation error.');
          validatingFunction(testingText).then(() => {
            assert.ok(true, 'Should resolve promise.');
          });
        });
      });

  ['',
    '123%',
    '*&?']
      .forEach((testingText) => {
        test(`RegExp pattern: '${EMAIL_VALIDATION_REGEX}', testing text: '${testingText}'`, function(assert) {
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Regexp validation error.');
          validatingFunction(testingText).catch((error) => {
            assert.strictEqual(error.message,
                'Regexp validation error.', 'Should reject with \'Regexp validation error.\'.');
          },
          );
        });
      });
});

module('validateSameValues', function() {
  ['helloWorld',
    ['Peter', 'hello'],
    123]
      .forEach((value) => {
        test(`Expected value : '${value}', testing value: '${value}'`, function(assert) {
          const validatingFunction = validateSameValue(value, 'Same values validation error.');
          validatingFunction(value).then(() => {
            assert.ok(true, 'Should resolve promise.');
          });
        });
      });

  [['expected', 'real'],
    [123, 456],
    [[123], [123, 123]]]
      .forEach(([expectedValue, testingValue]) => {
        test(`Expected value : '${expectedValue}, testing value: '${testingValue}'`, (assert) => {
          const validatingFunction = validateSameValue(expectedValue, 'Regexp validation error.');
          validatingFunction(testingValue).catch((error) => {
            assert.strictEqual(error.message,
                'Regexp validation error.', 'Should reject with \'Regexp validation error.\'.');
          },
          );
        });
      });
});
