import {AuthorizationValidator} from '../../validation/authorization-validator.js';
import {EMAIL_MIN_LENGTH, PASSWORD_MIN_LENGTH} from '../../constants.js';


const {module, test} = QUnit;

module('validateAuthorization', (hooks) => {
  const emailLengthErrorMessage = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
  const passwordLengthErrorMessage = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;

  let form;

  hooks.beforeEach(()=>{
    const fixture = document.getElementById('qunit-fixture');

    fixture.innerHTML = `
        <form action="" class="form-horizontal form-page">
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="email">Email</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="email" placeholder="Email" type="text"
                    name="email">
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
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    <button class="btn btn-primary" title="Sign In">Sign In</button>
                    <a class="form-link" href="" title="Sign Up">Don't have account?</a>
                </div>
            </div>
        </form>`;
    form = fixture.firstElementChild;

    new AuthorizationValidator().addValidationToForm(form);
  });

  [
    ['email', 'password',
      []],

    ['1', 'password',
      [emailLengthErrorMessage]],

    ['1%', 'pass',
      [emailLengthErrorMessage, passwordLengthErrorMessage]],

    ['email', 'pass',
      [passwordLengthErrorMessage]],
  ]
      .forEach(([email, pass, errorMessages])=>{
        test(`Email: ${email}, Password:  ${pass}`, async function(assert) {
          assert.expect(errorMessages.length+1);
          const done = assert.async();

          form.querySelector('input#email').value = email;
          form.querySelector('input#password').value = pass;

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
