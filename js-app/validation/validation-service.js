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
    const validationErrors = [];

    for (let i = 0; i < config.fieldValidators.length; i++) {
      const {fieldName, validators} = config.fieldValidators[i];

      const value = formData.get(fieldName);

      for (let j = 0; j < validators.length; j++) {
        try {
          await validators[j](value);
        } catch (error) {
          validationErrors.push(new ValidationError(fieldName, error.message));
        }
      }
    }

    if (validationErrors.length) {
      throw new ValidationErrorResult(validationErrors);
    }
  }
}
