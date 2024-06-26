import {ValidationError} from './validation-error';
import {ValidationErrorResult} from './validation-error-result';
import {FormValidationConfig} from './form-validation-config';

/**
 * Service for form validation.
 */
export class ValidationService {
  /**
   * Validates formData inputs by given config.
   *
   * @param {FormData} formData
   * @param {FormValidationConfig} config
   * @returns {Promise<void | ValidationErrorResult>}
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
