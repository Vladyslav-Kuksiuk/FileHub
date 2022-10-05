/**
 * Class to check function parameters.
 */
export class Preconditions {
  /**
   * Checks the type of the passed value using typeof.
   *
   * @param {any} value
   * @param {string} type
   */
  static checkType(value, type) {
    if (typeof value !== type) {
      throw new Error(`Illegal argument, expected: ${type}, provided: ${typeof value}.`);
    }
  }

  /**
   * Checks if an object is an instance of a class.
   *
   * @param {Object} object
   * @param {Class} clazz
   */
  static checkClassInstance(object, clazz) {
    if (!object instanceof clazz) {
      throw new Error(`Illegal argument, expected: ${clazz}.`);
    }
  }

  /**
   *  Checks if the state is true.
   *
   * @param {boolean} state
   */
  static checkState(state) {
    if (typeof state !== 'boolean') {
      throw new Error(`Illegal argument, expected: 'boolean', provided: ${typeof state}.`);
    }
    if (!state) {
      throw new Error('Illegal state.');
    }
  }
}
