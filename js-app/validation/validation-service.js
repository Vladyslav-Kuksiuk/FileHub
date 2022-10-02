import {ValidationError} from './validation-error.js';
import {ValidationErrorResult} from './validation-error-result.js';

export class ValidationService {
  validate(formData, config) {
    return new Promise((resolve, reject) => {
      const validationPromises = [];

      config.forEachField((field, validators) => {
        const inputValue = formData.get(field);
        validators
            .map((validator) => validator(inputValue))
            .forEach((promise) => {
              validationPromises.push({
                promise: promise,
                field: field,
              });
            });
      });

      Promise.allSettled(validationPromises.map((fieldPromise) => fieldPromise.promise))
          .then((results) => {
            for (let i = 0; i < validationPromises.length; i++) {
              validationPromises[i].result = results[i];
            }

            const errors = validationPromises
                .filter((promise) => promise.result.status === 'rejected')
                .map((promise) => new ValidationError(promise.field, promise.result.reason.message));

            if (errors.length > 0) {
              reject(new ValidationErrorResult(errors));
            } else {
              resolve();
            }
          });
    });
  }
}
