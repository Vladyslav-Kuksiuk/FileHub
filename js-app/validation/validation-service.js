import {ValidationError} from './validation-error.js';
import {ValidationErrorResult} from './validation-error-result.js';

/**
 * Service for form validation.
 */
export class ValidationService {
  /**
   * @param {FormData} formData
   * @param {FormValidationConfig} config
   * @returns {Promise<void>}
   */
  async validate(formData, config) {
    const validationPromises = config.fieldValidators.map(({fieldName, validators}) =>{
      const value = formData.get(fieldName);
      return validators.map((validator) => {
        return validator(value)
            .catch((error) => {
              throw new ValidationError(fieldName, error.message);
            });
      });
    }).flat();

    const validationErrors = (await Promise.allSettled(validationPromises))
        .filter((result) => result.status === 'rejected')
        .map((error) => error.reason);

    if (validationErrors.length) {
      throw new ValidationErrorResult(validationErrors);
    }
  }
}
