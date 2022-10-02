/**
 * {@link Error} which holds all {@link ValidationError}
 */
export class ValidationErrorResult extends Error {
  errors = [];

  /**
   * ValidationErrorResult constructor.
   * @param {[ValidationError]} errors
   */
  constructor(errors) {
    super();
    this.errors = errors;
  }
}
