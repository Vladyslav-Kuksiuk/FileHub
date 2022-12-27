import {validateByRegexp, validateLength, validateSameValue} from '../../src/validation/value-validations';
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z\d+.\-_@]+$/;

describe('validateLength', () => {
  [[5, 'hello world'],
    [0, ''],
    [1, 'some text']]
      .forEach(([minLength, testingText]) => {
        test(`Min length: '${minLength}', testing text: '${testingText}'`, function() {
          expect.assertions(1);
          const validatingFunction = validateLength(minLength, 'Length validation error.');
          validatingFunction(testingText).then(() => {
            expect(true).toBeTruthy();
          });
        });
      });

  [[1, ''],
    [5, '123'],
    [15, 'some text %636']]
      .forEach(([minLength, testingText]) => {
        test(`Min length: '${minLength}', testing text: '${testingText}'`, function() {
          expect.assertions(1);
          const validatingFunction = validateLength(minLength, 'Length validation error.');
          validatingFunction(testingText).catch((error) => {
            expect(error.message).toBe('Length validation error.');
          },
          );
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((minLength) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            validateLength(minLength, 'Length validation error.');
          } catch (error) {
            expect(error.message).toBe( 'Illegal state.');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            validateLength(1, errorMessage);
          } catch (error) {
            expect(error.message).toBe('Illegal argument, expected: \'string\'.');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            const validatingFunction = validateLength(1, 'Length validation error.');
            validatingFunction(value);
          } catch (error) {
            expect(error.message).toBe('Illegal argument, expected: \'string\'.');
          }
        });
      });
});

describe('validateRegex', function() {
  ['helloWorld',
    'Peter',
    '123']
      .forEach((testingText) => {
        test(`RegExp pattern: '${EMAIL_VALIDATION_REGEX}', testing text: '${testingText}'`, function() {
          expect.assertions(1);
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Regexp validation error.');
          validatingFunction(testingText).then(() => {
            expect(true).toBeTruthy();
          });
        });
      });

  ['',
    '123%',
    '*&?']
      .forEach((testingText) => {
        test(`RegExp pattern: '${EMAIL_VALIDATION_REGEX}', testing text: '${testingText}'`, function() {
          expect.assertions(1);
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Regexp validation error.');
          validatingFunction(testingText).catch((error) => {
            expect(error.message).toBe('Regexp validation error.');
          },
          );
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((regexp) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            validateByRegexp(regexp, 'RegExp validation error.');
          } catch (error) {
            expect(error.message).toBe( 'Illegal state.');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            validateByRegexp(EMAIL_VALIDATION_REGEX, errorMessage);
          } catch (error) {
            expect(error.message).toBe('Illegal argument, expected: \'string\'.');
          }
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Length validation error.');
            validatingFunction(value);
          } catch (error) {
            expect(error.message).toBe('Illegal argument, expected: \'string\'.');
          }
        });
      });
});

describe('validateSameValues', function() {
  ['helloWorld',
    ['Peter', 'hello'],
    123]
      .forEach((value) => {
        test(`Expected value : '${value}', testing value: '${value}'`, function() {
          expect.assertions(1);
          const validatingFunction = validateSameValue(value, 'Same values validation error.');
          validatingFunction(value).then(() => {
            expect(true).toBeTruthy();
          });
        });
      });

  [['expected', 'real'],
    [123, 456],
    [[123], [123, 123]]]
      .forEach(([expectedValue, testingValue]) => {
        test(`Expected value : '${expectedValue}, testing value: '${testingValue}'`, function() {
          expect.assertions(1);
          const validatingFunction = validateSameValue(expectedValue, 'Regexp validation error.');
          validatingFunction(testingValue).catch((error) => {
            expect(error.message).toBe('Regexp validation error.');
          },
          );
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text', function() {
          expect.assertions(1);
          try {
            validateSameValue(EMAIL_VALIDATION_REGEX, errorMessage);
          } catch (error) {
            expect(error.message).toBe('Illegal argument, expected: \'string\'.');
          }
        });
      });
});
