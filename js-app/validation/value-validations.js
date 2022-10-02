/**
 * Validates the minimum length of value.
 *
 * @param {int} minLength
 * @returns {function(*): Promise<string>}
 */
export function validateLength(minLength) {
  return (value) => {
    return new Promise((resolve, reject) => {
      if (value.length >= minLength) {
        resolve(`Length validated successfully!`);
      } else {
        reject(new Error(`Length validation failed!`));
      }
    });
  };
}

/**
 * Validates value by matching regex pattern.
 *
 * @param {RegExp} regex
 * @returns {function(*): Promise<unknown>}
 */
export function validateByRegex(regex) {
  return (value) => {
    return new Promise((resolve, reject) => {
      if (value.match(regex)) {
        resolve(`Regex validated successfully!`);
      } else {
        reject(new Error(`Regex validation failed!`));
      }
    });
  };
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
