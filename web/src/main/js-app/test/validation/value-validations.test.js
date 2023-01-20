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
          return validatingFunction(testingText).then(() => {
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
          return expect(validatingFunction(testingText)).rejects.toThrow(new Error('Length validation error.'));
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((minLength) => {
        test('Should return throw error because of illegal length value', function() {
          expect.assertions(1);
          expect(() => validateLength(minLength, 'Length validation error.'))
              .toThrow(new Error('Illegal state.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return throw error because of illegal error message', function() {
          expect.assertions(1);
          expect(() => validateLength(1, errorMessage))
              .toThrow(new Error('Illegal argument, expected: \'string\'.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Should return throw error because of validation value', function() {
          expect.assertions(1);
          const validatingFunction = validateLength(1, 'Length validation error.');
          expect(() => validatingFunction(value))
              .toThrow(new Error('Illegal argument, expected: \'string\'.'));
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
          return validatingFunction(testingText).then(() => {
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
          return expect(validatingFunction(testingText)).rejects.toThrow(new Error('Regexp validation error.'));
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((regexp) => {
        test('Should return error text', function() {
          expect.assertions(1);
          expect(() => validateByRegexp(regexp, 'RegExp validation error.'))
              .toThrow(new Error('Illegal state.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text because of invalid error message', function() {
          expect.assertions(1);
          expect(() => validateByRegexp(EMAIL_VALIDATION_REGEX, errorMessage))
              .toThrow(new Error('Illegal argument, expected: \'string\'.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Should return error text because of invalid validation value', function() {
          expect.assertions(1);
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Length validation error.');
          expect(() => validatingFunction(value))
              .toThrow(new Error('Illegal argument, expected: \'string\'.'));
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
          return validatingFunction(value).then(() => {
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
          return expect(validatingFunction(testingValue)).rejects
              .toThrow(new Error('Regexp validation error.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text', function() {
          expect.assertions(1);
          expect(() => validateSameValue(EMAIL_VALIDATION_REGEX, errorMessage))
              .toThrow(new Error('Illegal argument, expected: \'string\'.'));
        });
      });
});
