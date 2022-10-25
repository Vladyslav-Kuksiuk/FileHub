import {
  CONFIRM_PASSWORD,
  EMAIL,
  EMAIL_LENGTH_ERROR,
  EMAIL_VALIDATION_ERROR, PASSWORD,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MATCH_ERROR,
  RegistrationForm,
} from '../../src/components/registration-form';

describe('RegistrationForm', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });


  test('Should create and render RegistrationForm component', function() {
    expect.assertions(5);

    new RegistrationForm(document.body);

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(3);
    expect(document.body.querySelectorAll('[data-td="form-control"] input')[0].name).toBe(EMAIL);
    expect(document.body.querySelectorAll('[data-td="form-control"] input')[1].name).toBe(PASSWORD);
    expect(document.body.querySelectorAll('[data-td="form-control"] input')[2].name).toBe(CONFIRM_PASSWORD);
    expect(document.body.querySelector('[data-td="button-component"]').textContent).toBe('Sign Up');
  });

  [
    ['Email', 'Password', 'Password', [], [], []],
    ['ema', 'Password', 'Password', [EMAIL_LENGTH_ERROR], [], []],
    ['email%', 'Password', 'Password', [EMAIL_VALIDATION_ERROR], [], []],
    ['em%', 'Password', 'Password', [EMAIL_LENGTH_ERROR, EMAIL_VALIDATION_ERROR], [], []],
    ['Email', 'pass', 'pass', [], [PASSWORD_LENGTH_ERROR], []],
    ['em%', 'pass', 'password',
      [EMAIL_LENGTH_ERROR, EMAIL_VALIDATION_ERROR],
      [PASSWORD_LENGTH_ERROR],
      [PASSWORD_MATCH_ERROR],
    ],
  ].forEach(([email, password, confirm, emailErrors, passwordErrors, confirmErrors]) => {
    test(`Should render ${emailErrors.length + passwordErrors.length + passwordErrors.length} errors`, function(done) {
      expect.assertions(emailErrors.length + passwordErrors.length + confirmErrors.length);

      new RegistrationForm(document.body);
      document.body.querySelectorAll('[data-td="form-control"] input')[0].value = email;
      document.body.querySelectorAll('[data-td="form-control"] input')[1].value = password;
      document.body.querySelectorAll('[data-td="form-control"] input')[2].value = confirm;
      document.body.querySelector('[data-td="button-component"]').click();

      setTimeout(() => {
        emailErrors.forEach((error, index) => {
          expect(document.body.querySelectorAll('[data-td="form-control"]')[0]
              .querySelectorAll('[data-td="error-message"]')[index].textContent)
              .toBe(error);
        });
        passwordErrors.forEach((error, index) => {
          expect(document.body.querySelectorAll('[data-td="form-control"]')[1]
              .querySelectorAll('[data-td="error-message"]')[index].textContent)
              .toBe(error);
        });
        confirmErrors.forEach((error, index) => {
          expect(document.body.querySelectorAll('[data-td="form-control"]')[2]
              .querySelectorAll('[data-td="error-message"]')[index].textContent)
              .toBe(error);
        });

        done();
      });
    });
  });
});
