import {validateByRegex, validateLength, validateSameInput} from './value-validations.js';
import {
  CONFIRM_PASSWORD,
  EMAIL,
  EMAIL_MIN_LENGTH,
  EMAIL_VALIDATION_REGEX,
  PASSWORD,
  PASSWORD_MIN_LENGTH,
} from '../constants.js';
import {FormValidationConfigBuilder} from './form-validation-config.js';
import {ValidationService} from './validation-service.js';
import {clearError, renderError} from './render.js';

const form = document.getElementsByTagName('form')[0];
const registrationValidationConfig = new FormValidationConfigBuilder()
    .addField(EMAIL, validateLength(EMAIL_MIN_LENGTH), validateByRegex(EMAIL_VALIDATION_REGEX))
    .addField(PASSWORD, validateLength(PASSWORD_MIN_LENGTH))
    .addField(CONFIRM_PASSWORD, validateSameInput(document.getElementsByName(PASSWORD)[0]))
    .build();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  clearError();

  const formData = new FormData(event.target);

  new ValidationService()
      .validate(formData, registrationValidationConfig)
      .catch((result) => {
        result.errors.forEach((error) => renderError(error.name, error.message));
      });
});
