import {Preconditions} from '../preconditions.js';

/**
 * Validates the minimum length of value.
 *
 * @param {int} minLength
 * @param {string} errorMessage
 * @returns {function(*): Promise<string>}
 */
export function validateLength(minLength, errorMessage) {
  Preconditions.checkState(Number.isInteger(minLength));
  Preconditions.checkState(minLength >= 0);
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
 * @returns {function(*): Promise<string>}
 */
export function validateByRegexp(regex, errorMessage) {
  Preconditions.checkType(errorMessage, 'string');
  Preconditions.checkState(regex instanceof RegExp);

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
 * @param {any} referencedValue
 * @param {string} errorMessage
 * @returns {function(*): Promise<string>}
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
