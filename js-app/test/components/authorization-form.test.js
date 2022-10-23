import {AuthorizationForm, EMAIL_LENGTH_ERROR, PASSWORD_LENGTH_ERROR} from '../../src/components/authorization-form';

describe('AuthorizationForm Component', () => {
  test(`AuthorizationForm constructor`, function() {
    expect.assertions(2);

    new AuthorizationForm(document.body);

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(2);
    expect(document.body.querySelector('[data-td="button-component"]').textContent).toBe('Sign In');
  });

  [
    ['Email', 'Password', [], []],
    ['ema', 'password', [EMAIL_LENGTH_ERROR], []],
    ['Email', 'pass', [], [PASSWORD_LENGTH_ERROR]],
    ['ema', 'pass', [EMAIL_LENGTH_ERROR], [PASSWORD_LENGTH_ERROR]],
  ].forEach(([email, password, emailErrors, passwordErrors])=>{
    test(`AuthorizationForm validation, email: ${email}, password: ${password}`, function(done) {
      expect.assertions(emailErrors.length + passwordErrors.length);

      new AuthorizationForm(document.body);
      document.body.querySelectorAll('[data-td="form-control"] input')[0].value = email;
      document.body.querySelectorAll('[data-td="form-control"] input')[1].value = password;
      document.body.querySelector('[data-td="button-component"]').click();

      setTimeout( () => {
        for (let i = 0; i < emailErrors.length; i++) {
          expect(document.body.querySelectorAll('[data-td="form-control"]')[0]
              .querySelectorAll('[data-td="error-message"]')[i].textContent)
              .toBe(emailErrors[i]);
        }
        for (let i = 0; i < passwordErrors.length; i++) {
          expect(document.body.querySelectorAll('[data-td="form-control"]')[1]
              .querySelectorAll('[data-td="error-message"]')[i].textContent)
              .toBe(passwordErrors[i]);
        }
        done();
      });
    });
  });
});
