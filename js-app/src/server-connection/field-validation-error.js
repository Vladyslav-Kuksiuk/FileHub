import {ApiServiceError} from './api-service-error.js';

/**
 * ApiService error with field errors.
 */
export class FieldValidationError extends ApiServiceError {
  fieldErrors;

  /**
   * @typedef {object} Error
   * @property {string} fieldName
   * @property {string} errorText
   */

  /**
   * @param {Error[]} errors - Object structure {fieldName - errorText}.
   */
  constructor(errors) {
    super();
    this.fieldErrors = errors;
  }
}
