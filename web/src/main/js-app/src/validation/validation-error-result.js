import {ValidationError} from './validation-error.js';

/**
 * {@link Error} Which holds all {@link ValidationError}.
 */
export class ValidationErrorResult extends Error {
  errors = [];

  /**
   * ValidationErrorResult constructor.
   * @param {ValidationError[]} errors
   */
  constructor(errors) {
    super();
    this.errors = errors;
  }
}
