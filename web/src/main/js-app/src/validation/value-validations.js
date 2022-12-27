import {Preconditions} from '../preconditions';

/**
 * Validates the minimum length of value.
 *
 * @param {number} minLength
 * @param {string} errorMessage
 * @returns {function(*): Promise<void | Error>}
 */
export function validateLength(minLength, errorMessage) {
  Preconditions.checkTrue(Number.isInteger(minLength));
  Preconditions.checkTrue(minLength >= 0);
  Preconditions.checkType(errorMessage, 'string');

  return (value) => {
    Preconditions.checkType(value, 'string');

    return new Promise((resolve, reject) => {
      if (value.length >= minLength) {
        resolve();
      } else {
        reject(new Error(errorMessage));
      }
    });
  };
}

/**
 * Validates value by matching regex pattern.
 *
 * @param {RegExp} regex
 * @param {string} errorMessage
 * @returns {function(string): Promise<void | Error>}
 */
export function validateByRegexp(regex, errorMessage) {
  Preconditions.checkType(errorMessage, 'string');
  Preconditions.checkTrue(regex instanceof RegExp);

  return (value) => {
    Preconditions.checkType(value, 'string');

    return new Promise((resolve, reject) => {
      if (value.match(regex)) {
        resolve();
      } else {
        reject(new Error(errorMessage));
      }
    });
  };
}

/**
 * Validates the consistency of input values.
 *
 * @param {any} referencedValue
 * @param {string} errorMessage
 * @returns {function(*): Promise<void | Error>}
 */
export function validateSameValue(referencedValue, errorMessage) {
  Preconditions.checkType(errorMessage, 'string');

  return (value) => {
    return new Promise((resolve, reject) => {
      if (value === referencedValue) {
        resolve();
      } else {
        reject(new Error(errorMessage));
      }
    });
  };
}
