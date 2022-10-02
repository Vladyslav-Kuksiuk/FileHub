import {clearError, renderError} from './render.js';
import {ValidationService} from './validation-service.js';

export function formOnsubmitValidation(form, validationConfig) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    clearError();

    const formData = new FormData(event.target);

    new ValidationService()
        .validate(formData, validationConfig)
        .catch((result) => {
          result.errors.forEach((error) => renderError(error.name, error.message));
        });
  });
}
