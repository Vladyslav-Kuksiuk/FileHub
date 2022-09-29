import {validateInputLength} from './validations.js';
import {EMAIL, EMAIL_MIN_LENGTH, PASSWORD, PASSWORD_MIN_LENGTH} from './constants.js';

const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  Promise.allSettled([
    validateInputLength(EMAIL, EMAIL_MIN_LENGTH),
    validateInputLength(PASSWORD, PASSWORD_MIN_LENGTH),
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
      console.log('Authorization failed!');
    } else {
      // eslint-disable-next-line no-console
      console.log('Authorization passed successfully!');
    }
  });
});
