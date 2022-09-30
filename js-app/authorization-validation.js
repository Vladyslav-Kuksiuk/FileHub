import {validateInputLength} from './validations.js';
import {EMAIL, EMAIL_MIN_LENGTH, PASSWORD, PASSWORD_MIN_LENGTH} from './constants.js';

const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  Promise.allSettled([
    validateInputLength(formData.get(EMAIL), EMAIL_MIN_LENGTH),
    validateInputLength(formData.get(PASSWORD), PASSWORD_MIN_LENGTH),
  ]).then((results) => {
    const errors = results.filter((result) => result.status === 'rejected');

    if (errors.length > 0) {
      // eslint-disable-next-line no-console
      errors.forEach((error) => console.log(error.reason));
      // eslint-disable-next-line no-console
      console.log('Authorization failed!');
    } else {
      // eslint-disable-next-line no-console
      console.log('Authorization passed successfully!');
    }
  });
});
