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
          return expect(validatingFunction(testingText)).resolves.toBeUndefined();
        });
      });

  [[1, ''],
    [5, '123'],
    [15, 'some text %636']]
      .forEach(([minLength, testingText]) => {
        test(`Min length: '${minLength}', testing text: '${testingText}'`, function() {
          expect.assertions(1);
          const error = 'Length validation error.';
          const validatingFunction = validateLength(minLength, error);
          return expect(validatingFunction(testingText)).rejects.toEqual(new Error(error));
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((minLength) => {
        test('Should return error text about illegal minLength value', function() {
          expect.assertions(1);
          return expect(()=>{
            validateLength(minLength, 'Length validation error.');
          }).toThrow(new Error('Illegal state.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text about illegal error message', function() {
          expect.assertions(1);
          return expect(()=>{
            validateLength(1, errorMessage);
          }).toThrow(new Error('Illegal argument, expected: \'string\'.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Should return error text about illegal validation value', function() {
          expect.assertions(1);
          const validatingFunction = validateLength(1, 'Length validation error.');
          return expect(()=>{
            validatingFunction(value);
          }).toThrow(new Error('Illegal argument, expected: \'string\'.'));
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
          return expect(validatingFunction(testingText)).resolves.toBeUndefined();
        });
      });

  ['',
    '123%',
    '*&?']
      .forEach((testingText) => {
        test(`RegExp pattern: '${EMAIL_VALIDATION_REGEX}', testing text: '${testingText}'`, function() {
          expect.assertions(1);
          const error = 'Regexp validation error.';
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, error);
          return expect( validatingFunction(testingText)).rejects.toEqual(new Error(error));
        });
      });

  [null, NaN, undefined, [], {}, -1, 'hello']
      .forEach((regexp) => {
        test('Should return error text about illegal regExp value', function() {
          expect.assertions(1);
          return expect(()=>{
            validateByRegexp(regexp, 'RegExp validation error.');
          }).toThrow(new Error('Illegal state.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error tex about illegal error message value', function() {
          expect.assertions(1);
          return expect(()=>{
            validateByRegexp(EMAIL_VALIDATION_REGEX, errorMessage);
          }).toThrow(new Error('Illegal argument, expected: \'string\'.'));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((value) => {
        test('Should return error text about illegal validation value', function() {
          expect.assertions(1);
          const validatingFunction = validateByRegexp(EMAIL_VALIDATION_REGEX, 'Length validation error.');
          return expect(()=>{
            validatingFunction(value);
          }).toThrow(new Error('Illegal argument, expected: \'string\'.'));
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
          return expect(validatingFunction(value)).resolves.toBeUndefined();
        });
      });

  [['expected', 'real'],
    [123, 456],
    [[123], [123, 123]]]
      .forEach(([expectedValue, testingValue]) => {
        test(`Expected value : '${expectedValue}, testing value: '${testingValue}'`, function() {
          expect.assertions(1);
          const error = 'Regexp validation error.';
          const validatingFunction = validateSameValue(expectedValue, error);
          return expect(validatingFunction(testingValue)).rejects.toEqual(new Error(error));
        });
      });

  [null, NaN, undefined, [], {}, -1]
      .forEach((errorMessage) => {
        test('Should return error text', function() {
          expect.assertions(1);
          return expect(()=>{
            validateSameValue(EMAIL_VALIDATION_REGEX, errorMessage);
          }).toThrow(new Error('Illegal argument, expected: \'string\'.'));
        });
      });
});
