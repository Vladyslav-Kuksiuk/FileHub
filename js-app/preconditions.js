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
      throw new Error(`Illegal argument, expected: '${type}'.`);
    }
  }

  /**
   *  Checks if the state is true.
   *
   * @param {boolean} state
   */
  static checkState(state) {
    if (typeof state !== 'boolean') {
      throw new Error(`Illegal argument, expected: 'boolean'.`);
    }
    if (!state) {
      throw new Error('Illegal state.');
    }
  }
}
