import {
  EMAIL_LENGTH_ERROR, EMAIL_VALIDATION_ERROR,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MATCH_ERROR,
  RegistrationForm,
} from '../../src/components/registration-form';

describe('RegistrationForm Component', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`RegistrationForm constructor`, function() {
    expect.assertions(2);

    new RegistrationForm(document.body);

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(3);
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
  ].forEach(([email, password, confirm, emailErrors, passwordErrors, confirmErrors])=>{
    test(`RegistrationForm validation, email: ${email}, password: ${password}`, function(done) {
      expect.assertions(emailErrors.length + passwordErrors.length +confirmErrors.length + 1);

      new RegistrationForm(document.body);
      document.body.querySelectorAll('[data-td="form-control"] input')[0].value = email;
      document.body.querySelectorAll('[data-td="form-control"] input')[1].value = password;
      document.body.querySelectorAll('[data-td="form-control"] input')[2].value = confirm;
      document.body.querySelector('[data-td="button-component"]').click();

      setTimeout(()=>{
        for (let i=0; i < emailErrors.length; i++ ) {
          expect(document.body.querySelectorAll('[data-td="form-control"]')[0]
              .querySelectorAll('[data-td="error-message"]')[i].textContent)
              .toBe(emailErrors[i]);
        }
        for (let i=0; i < passwordErrors.length; i++ ) {
          expect( document.body.querySelectorAll('[data-td="form-control"]')[1]
              .querySelectorAll('[data-td="error-message"]')[i].textContent)
              .toBe(passwordErrors[i]);
        }
        for (let i=0; i < confirmErrors.length; i++ ) {
          expect( document.body.querySelectorAll('[data-td="form-control"]')[2]
              .querySelectorAll('[data-td="error-message"]')[i].textContent)
              .toBe(confirmErrors[i]);
        }

        expect(true).toBe(true);
        done();
      });
    });
  });
});
