import {validateByRegex, validateLength, validateSameValues} from './validations.js';
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

  const formData = new FormData(event.target);

  Promise.allSettled([
    validateLength(formData.get(EMAIL), EMAIL_MIN_LENGTH),
    validateLength(formData.get(PASSWORD), PASSWORD_MIN_LENGTH),
    validateByRegex(formData.get(EMAIL), EMAIL_VALIDATION_REGEX),
    validateSameValues(formData.get(PASSWORD), formData.get(CONFIRM_PASSWORD)),
  ]).then((results) => {
    const errors = results.filter((result) => result.status === 'rejected');

    if (errors.length > 0) {
      // eslint-disable-next-line no-console
      errors.forEach((error) => console.log(error.reason));
      // eslint-disable-next-line no-console
      console.log('Registration failed!');
    } else {
      // eslint-disable-next-line no-console
      console.log('Registration passed successfully!');
    }
  });
});
