export class FormValidationConfigBuilder {
  fieldValidators = [];

  addField(fieldName, ...validators) {
    this.fieldValidators.push({
      fieldName: fieldName,
      validators: validators,
    });
    return this;
  }

  build() {
    return new FormValidationConfig(this.fieldValidators);
  }
}

export class FormValidationConfig {
  fieldValidators = [];

  constructor(fieldValidators) {
    this.fieldValidators = fieldValidators;
  }

  forEachField(func) {
    this.fieldValidators.forEach((fieldValidators) => {
      func(fieldValidators.fieldName, fieldValidators.validators);
    });
  }
}

export class ValidationService {
  validate(formData, config) {
    return new Promise((resolve, reject) => {
      let validationPromises = [];

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

      Promise.allSettled(validationPromises.map(fieldPromise => fieldPromise.promise))
        .then(results => {

          for (let i = 0; i < validationPromises.length; i++) {
            validationPromises[i].result = results[i];
          }

          const errors = validationPromises
            .filter(promise => promise.result.status === 'rejected')
            .map(promise => new ValidationError(promise.field, promise.result.reason.message));

          if (errors.length > 0) {
            reject(new ValidationErrorResult(errors));
          } else {
            resolve();
          }
        });
    });
  }
}

export function renderError(inputName, message) {

  const input = document.getElementsByName(inputName)[0];
  input.classList.add('input-error');
  const helpBlock = document.createElement('p');
  helpBlock.classList.add('help-block', 'text-danger');
  helpBlock.textContent = message;
  input.parentElement.append(helpBlock);

}

export function clearError() {
  const inputs = [...document.getElementsByTagName('input')];
  inputs.forEach(input => {
    input.classList.remove('input-error');
    [...input.parentElement
      .getElementsByClassName('help-block')]
      .forEach(helpBlock => helpBlock.remove());
  });

}

export class ValidationErrorResult extends Error {
  errors = [];

  constructor(errors) {
    super();
    this.errors = errors;
  }
}

export class ValidationError {
  name;
  message;

  constructor(name, message) {
    this.name = name;
    this.message = message;
  }
}

/**
 * Validates the minimum length of value.
 *
 * @param {int} minLength
 * @returns {function(*): Promise<string>}
 */
export function validateLength(minLength) {
  return (value) => {
    return new Promise((resolve, reject) => {
      if (value.length >= minLength) {
        resolve(`Length validated successfully!`);
      } else {
        reject(new Error(`Length validation failed!`));
      }
    });
  };
}

/**
 * Validates value by matching regex pattern.
 *
 * @param {RegExp} regex
 * @returns {function(*): Promise<unknown>}
 */
export function validateByRegex(regex) {
  return (value) => {
    return new Promise((resolve, reject) => {
      if (value.match(regex)) {
        resolve(`Regex validated successfully!`);
      } else {
        reject(new Error(`Regex validation failed!`));
      }
    });
  };
}

/**
 * Validates the consistency of input values.
 *
 * @param {unknown} values
 * @returns {Promise<string>}
 */
export function validateSameValues(...values) {
  return new Promise((resolve, reject) => {
    if (values.some((e) => e !== values[0])) {
      reject(new Error(`Values not match!`));
    } else {
      resolve(`Values are same!`);
    }
  });
}
