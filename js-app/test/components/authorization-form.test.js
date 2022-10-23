import {
  AuthorizationForm,
  EMAIL,
  EMAIL_LENGTH_ERROR, PASSWORD,
  PASSWORD_LENGTH_ERROR,
} from '../../src/components/authorization-form';

describe('AuthorizationForm', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should create and render AuthorizationForm component`, function() {
    expect.assertions(4);

    new AuthorizationForm(document.body);

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(2);
    expect(document.body.querySelectorAll('[data-td="form-control"] input')[0].name).toBe(EMAIL);
    expect(document.body.querySelectorAll('[data-td="form-control"] input')[1].name).toBe(PASSWORD);
    expect(document.body.querySelector('[data-td="button-component"]').textContent).toBe('Sign In');
  });

  [
    ['Email', 'Password', [], []],
    ['ema', 'password', [EMAIL_LENGTH_ERROR], []],
    ['Email', 'pass', [], [PASSWORD_LENGTH_ERROR]],
    ['ema', 'pass', [EMAIL_LENGTH_ERROR], [PASSWORD_LENGTH_ERROR]],
  ].forEach(([email, password, emailErrors, passwordErrors])=>{
    test(`Should render ${emailErrors.length + passwordErrors.length} errors`, function(done) {
      expect.assertions(emailErrors.length + passwordErrors.length);

      new AuthorizationForm(document.body);
      document.body.querySelectorAll('[data-td="form-control"] input')[0].value = email;
      document.body.querySelectorAll('[data-td="form-control"] input')[1].value = password;
      document.body.querySelector('[data-td="button-component"]').click();

      setTimeout( () => {
        emailErrors.forEach((error, index)=>{
          expect(document.body.querySelectorAll('[data-td="form-control"]')[0]
              .querySelectorAll('[data-td="error-message"]')[index].textContent)
              .toBe(error);
        });
        passwordErrors.forEach((error, index)=>{
          expect(document.body.querySelectorAll('[data-td="form-control"]')[1]
              .querySelectorAll('[data-td="error-message"]')[index].textContent)
              .toBe(error);
        });
        done();
      });
    });
  });
});
