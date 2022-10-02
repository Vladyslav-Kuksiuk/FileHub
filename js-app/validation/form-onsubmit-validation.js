import {clearFormErrors, renderError} from './render.js';
import {ValidationService} from './validation-service.js';

/**
 * Add submit event listener to validate form inputs by config.
 *
 * @param {HTMLElement} form
 * @param {FormValidationConfig }validationConfig
 */
export function formOnsubmitValidation(form, validationConfig) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    clearFormErrors();

    const formData = new FormData(event.target);

    new ValidationService()
        .validate(formData, validationConfig)
        .catch((result) => {
          result.errors.forEach((error) => renderError(error.name, error.message));
        });
  });
}
