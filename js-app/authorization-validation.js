import {
  clearError,
  FormValidationConfigBuilder,
  renderError,
  validateByRegex,
  validateLength,
  ValidationService,
} from './validations.js';
import {EMAIL, EMAIL_MIN_LENGTH, EMAIL_VALIDATION_REGEX, PASSWORD, PASSWORD_MIN_LENGTH} from './constants.js';

const form = document.getElementsByTagName('form')[0];
const authorizationValidationConfig = new FormValidationConfigBuilder()
    .addField(EMAIL, validateLength(EMAIL_MIN_LENGTH), validateByRegex(EMAIL_VALIDATION_REGEX))
    .addField(PASSWORD, validateLength(PASSWORD_MIN_LENGTH))
    .build();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError()

  const formData = new FormData(event.target);

  new ValidationService()
      .validate(formData, authorizationValidationConfig)
      .then(()=> console.log('success'))
      .catch((result) =>{
        result.errors.forEach((error)=> renderError(error.name, error.message));
      });
});
