import {EMAIL_MIN_LENGTH, PASSWORD_MIN_LENGTH} from '../../constants.js';
import {RegistrationValidator} from '../../validation/registration-validator.js';


const {module, test} = QUnit;

module('validateRegistration', (hooks) => {
  const emailLengthErrorMessage = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
  const emailRegexpErrorMessage = 'Allowed only a-Z and +.-_@ .';
  const passwordLengthErrorMessage = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;
  const passwordMatchErrorMessage = 'Passwords don\'t match.';

  let form;

  hooks.beforeEach(() => {
    const fixture = document.getElementById('qunit-fixture');

    fixture.innerHTML = `
        <form action="" class="form-horizontal form-page">
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="email">Email</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="email" placeholder="Email" type="text" name="email">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="password">Password</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="password" placeholder="Password"
                           type="password" name="password">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="confirm-password">Confirm Password</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="confirm-password" placeholder="Confirm Password"
                           type="password" name="confirm-password">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    <button class="btn btn-primary" title="Sign Up">Sign Up</button>
                    <a class="form-link" href="" title="Sign In">Already have an account?</a>
                </div>
            </div>
        </form>`;
    form = fixture.firstElementChild;

    new RegistrationValidator().addValidationToForm(form);
  });

  [
    ['email', 'password', 'password',
      []],

    ['1', 'password', 'password',
      [emailLengthErrorMessage]],

    ['1%%%%%!', 'password', 'password',
      [emailRegexpErrorMessage]],

    ['email', 'pass', 'pass',
      [passwordLengthErrorMessage]],

    ['email', 'password', 'notPassword',
      [passwordMatchErrorMessage]],

    ['1', 'password', 'notPassword',
      [emailLengthErrorMessage, passwordMatchErrorMessage]],

    ['1%', 'password', 'password',
      [emailLengthErrorMessage, emailRegexpErrorMessage]],

    ['1%', 'pass', 'pass',
      [emailLengthErrorMessage, emailRegexpErrorMessage, passwordLengthErrorMessage]],

    ['1%', 'pass', 'notPassword',
      [emailLengthErrorMessage, emailRegexpErrorMessage, passwordLengthErrorMessage, passwordMatchErrorMessage]],
  ]
      .forEach(([email, pass, confirm, errorMessages])=>{
        test(`Email: ${email}, Password:  ${pass}, Confirm password:  ${confirm}`, async function(assert) {
          assert.expect(errorMessages.length+1);
          const done = assert.async();

          form.querySelector('input#email').value = email;
          form.querySelector('input#password').value = pass;
          form.querySelector('input#confirm-password').value = confirm;

          form.querySelector('button').click();

          setTimeout(() => {
            const errors = [...form.querySelectorAll('.help-block')];
            assert.strictEqual(errors.length, errorMessages.length, 'Should have same amount of errors');

            for (let i=0; i < errorMessages.length; i++) {
              assert.strictEqual(errors[i].innerText, errorMessages[i],
                  `Should show error '${errorMessages[i]}'`);
            }
            done();
          });
        });
      });
});
