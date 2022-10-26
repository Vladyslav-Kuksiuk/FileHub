/**
 * Error with register errors.
 */
export class RegisterError extends Error {
  errors = [];

  /**
   * @param {object} errors - Object structure {fieldName - errorText}.
   */
  constructor(errors) {
    super();
    this.errors = errors;
  }
}
