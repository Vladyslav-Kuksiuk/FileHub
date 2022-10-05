import {validateByRegexp, validateLength, validateSameValue} from '../../validation/value-validations.js';
import {EMAIL_VALIDATION_REGEX} from '../../constants.js';

const {module, test} = QUnit;

module('validateLength', () => {
  [[5, 'hello world'],
    [0, ''],
    [1, 'some text']]
      .forEach(([minLength, testingText]) => {
        test(`Min length: '${minLength}', testing text: '${testingText}'`, function(assert) {
          assert.expect(1);
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
          assert.expect(1);
          const validatingFunction = validateLength(minLength, 'Length validation error.');
          validatingFunction(testingText).catch((error) => {
            assert.strictEqual(error.message,
                'Length validation error.', 'Should reject with \'Length validation error.\'.');
          },
          );
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((minLength) => {
        test('Test illegal values of minLength', function(assert) {
          assert.expect(1);
          try {
            validateLength(minLength, 'Length validation error.');
          } catch (error) {
            assert.strictEqual(error.message, 'Illegal state.', 'Should throw Error \'Illegal state.\' ');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Test illegal values of errorMessage', function(assert) {
          assert.expect(1);
          try {
            validateLength(1, errorMessage);
          } catch (error) {
            assert.strictEqual(error.message,
                'Illegal argument, expected: \'string\'.',
                'Should throw Error \'Illegal argument, expected: \'string\'.\'');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Test illegal values to validate', function(assert) {
          assert.expect(1);
          try {
            const validatingFunction = validateLength(1, 'Length validation error.');
            validatingFunction(value);
          } catch (error) {
            assert.strictEqual(error.message,
                'Illegal argument, expected: \'string\'.',
                'Should throw Error \'Illegal argument, expected: \'string\'.\' ');
          }
        });
      });
});

module('validateRegex', function() {
  ['helloWorld',
    'Peter',
    '123']
      .forEach((testingText) => {
        test(`RegExp pattern: '${EMAIL_VALIDATION_REGEX}', testing text: '${testingText}'`, function(assert) {
          assert.expect(1);
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
          assert.expect(1);
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Regexp validation error.');
          validatingFunction(testingText).catch((error) => {
            assert.strictEqual(error.message,
                'Regexp validation error.', 'Should reject with \'Regexp validation error.\'.');
          },
          );
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((regexp) => {
        test('Test illegal values of regexp', function(assert) {
          assert.expect(1);
          try {
            validateByRegexp(regexp, 'RegExp validation error.');
          } catch (error) {
            assert.strictEqual(error.message, 'Illegal state.', 'Should throw Error \'Illegal state.\' ');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Test illegal values of errorMessage', function(assert) {
          assert.expect(1);
          try {
            validateByRegexp(EMAIL_VALIDATION_REGEX, errorMessage);
          } catch (error) {
            assert.strictEqual(error.message,
                'Illegal argument, expected: \'string\'.',
                'Should throw Error \'Illegal argument, expected: \'string\'.\'');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Test illegal values to validate', function(assert) {
          assert.expect(1);
          try {
            const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Length validation error.');
            validatingFunction(value);
          } catch (error) {
            assert.strictEqual(error.message,
                'Illegal argument, expected: \'string\'.',
                'Should throw Error \'Illegal argument, expected: \'string\'.\' ');
          }
        });
      });
});

module('validateSameValues', function() {
  ['helloWorld',
    ['Peter', 'hello'],
    123]
      .forEach((value) => {
        test(`Expected value : '${value}', testing value: '${value}'`, function(assert) {
          assert.expect(1);
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
          assert.expect(1);
          const validatingFunction = validateSameValue(expectedValue, 'Regexp validation error.');
          validatingFunction(testingValue).catch((error) => {
            assert.strictEqual(error.message,
                'Regexp validation error.', 'Should reject with \'Regexp validation error.\'.');
          },
          );
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Test illegal values of errorMessage', function(assert) {
          assert.expect(1);
          try {
            validateSameValue(EMAIL_VALIDATION_REGEX, errorMessage);
          } catch (error) {
            assert.strictEqual(error.message,
                'Illegal argument, expected: \'string\'.',
                'Should throw Error \'Illegal argument, expected: \'string\'.\'');
          }
        });
      });
});
