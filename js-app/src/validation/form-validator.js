import {clearFormErrors, renderError} from './render.js';
import {ValidationService} from './validation-service.js';

/**
 * Abstract class to add configured validator on form.
 */
export class FormValidator {
  /**
   * Forbidden constructor (to make class abstract).
   */
  constructor() {
    if (this.constructor === FormValidator) {
      throw new Error(' Object of Abstract Class cannot be created');
    }
  }

  /**
   * Adds configured validation to form.
   * @param {HTMLFormElement} form
   */
  addValidationToForm(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      clearFormErrors();

      const formData = new FormData(event.target);
      const validationConfig = this.createValidationConfig(formData);

      new ValidationService()
          .validate(formData, validationConfig)
          .catch((result) => {
            result.errors.forEach((error) => renderError(error.name, error.message));
          });
    });
  }

  /**
   * @param {FormData} formData
   * @abstract
   * @returns {FormValidationConfig}
   */
  createValidationConfig(formData) {
    throw new Error('Method of Abstract Class cannot be called');
  }
}
