import {
  CONFIRM_PASSWORD,
  EMAIL,
  EMAIL_LENGTH_ERROR,
  EMAIL_VALIDATION_ERROR, PASSWORD,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MATCH_ERROR,
  RegistrationForm,
} from '../../../src/application-components/registration/registration-form';

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
    {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Password',
      emailErrors: [],
      passwordErrors: [],
      confirmPasswordErrors: [],
    },
    {
      email: 'ema',
      password: 'Password',
      confirmPassword: 'Password',
      emailErrors: [EMAIL_LENGTH_ERROR],
      passwordErrors: [],
      confirmPasswordErrors: [],
    },
    {
      email: 'email%',
      password: 'Password',
      confirmPassword: 'Password',
      emailErrors: [EMAIL_VALIDATION_ERROR],
      passwordErrors: [],
      confirmPasswordErrors: [],
    },
    {
      email: 'em%',
      password: 'Password',
      confirmPassword: 'Password',
      emailErrors: [EMAIL_LENGTH_ERROR, EMAIL_VALIDATION_ERROR],
      passwordErrors: [],
      confirmPasswordErrors: [],
    },
    {
      email: 'Email',
      password: 'pass',
      confirmPassword: 'pass',
      emailErrors: [],
      passwordErrors: [PASSWORD_LENGTH_ERROR],
      confirmPasswordErrors: [],
    },
    {
      email: 'em%',
      password: 'pass',
      confirmPassword: 'password',
      emailErrors: [EMAIL_LENGTH_ERROR, EMAIL_VALIDATION_ERROR],
      passwordErrors: [PASSWORD_LENGTH_ERROR],
      confirmPasswordErrors: [PASSWORD_MATCH_ERROR],
    },
  ].forEach(({
    email,
    password,
    confirmPassword,
    emailErrors,
    passwordErrors,
    confirmPasswordErrors}) => {
    test(`Should render ${emailErrors.length + passwordErrors.length + passwordErrors.length} errors`, function() {
      return new Promise((done) => {
        expect.assertions(emailErrors.length + passwordErrors.length + confirmPasswordErrors.length);

        new RegistrationForm(document.body);
        document.body.querySelectorAll('[data-td="form-control"] input')[0].value = email;
        document.body.querySelectorAll('[data-td="form-control"] input')[1].value = password;
        document.body.querySelectorAll('[data-td="form-control"] input')[2].value = confirmPassword;
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
          confirmPasswordErrors.forEach((error, index) => {
            expect(document.body.querySelectorAll('[data-td="form-control"]')[2]
                .querySelectorAll('[data-td="error-message"]')[index].textContent)
                .toBe(error);
          });

          done();
        });
      });
    });
  });
});
