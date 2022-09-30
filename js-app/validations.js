/**
 * Validates the minimum length of value.
 *
 * @param {string} value
 * @param {int} minLength
 * @returns {Promise<string>}
 */
export function validateLength(value, minLength) {
  return new Promise((resolve, reject) => {
    if (value.length >= minLength) {
      resolve(`'${value}' length validated successfully!`);
    } else {
      reject(new Error(`'${value}' length validation failed!`));
    }
  });
}

/**
 * Validates value by matching regex pattern.
 *
 * @param {string} value
 * @param {RegExp} regex
 * @returns {Promise<string>}
 */
export function validateByRegex(value, regex) {
  return new Promise((resolve, reject) => {
    if (value.match(regex)) {
      resolve(`Input ${value} regex validated successfully!`);
    } else {
      reject(new Error(`Input ${value} regex validation failed!`));
    }
  });
}

/**
 * Validates the consistency of input values.
 *
 * @param {unknown} values
 * @returns {Promise<string>}
 */
export function validateSameValues(...values) {
  return new Promise((resolve, reject) => {
    if (values.some((e) => e !== values[0])) {
      reject(new Error(`Values not match!`));
    } else {
      resolve(`Values are same!`);
    }
  });
}
