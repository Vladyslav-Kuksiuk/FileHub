import {validateInputByRegex, validateInputLength, validateSameInputsValue} from './validations.js';
import {
  CONFIRM_PASSWORD,
  EMAIL,
  EMAIL_MIN_LENGTH,
  EMAIL_VALIDATION_REGEX,
  PASSWORD,
  PASSWORD_MIN_LENGTH,
} from './constants.js';

const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  Promise.allSettled([
    validateInputLength(EMAIL, EMAIL_MIN_LENGTH),
    validateInputLength(PASSWORD, PASSWORD_MIN_LENGTH),
    validateInputByRegex(EMAIL, EMAIL_VALIDATION_REGEX),
    validateSameInputsValue(PASSWORD, CONFIRM_PASSWORD),
  ]).then((results) => {
    let hasError = false;

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        // eslint-disable-next-line no-console
        console.log(result.value);
      } else {
        // eslint-disable-next-line no-console
        console.log(result.reason);
        hasError = true;
      }
    });

    if (hasError) {
      // eslint-disable-next-line no-console
      console.log('Registration failed!');
    } else {
      // eslint-disable-next-line no-console
      console.log('Registration passed successfully!');
    }
  });
});