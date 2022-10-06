import {AuthorizationValidator} from '../../validation/authorization-validator.js';
import {EMAIL_MIN_LENGTH, PASSWORD_MIN_LENGTH} from '../../constants.js';


const {module, test} = QUnit;

module('validateAuthorization', (hooks) => {
  const emailErrorMessage = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
  const passwordErrorMessage = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;

  let form;

  hooks.before(()=>{
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

  [['ema', 'pass'],
    ['http', '1cq']]
      .forEach(([emailValue, passwordValue]) =>{
        test(`Email: ${emailValue}, Password: ${passwordValue}`, function(assert) {
          assert.expect(2);
          const done = assert.async();

          const emailInput = form.querySelector('input#email');
          emailInput.value = emailValue;

          const passwordInput = form.querySelector('input#password');
          passwordInput.value = passwordValue;

          const button = form.querySelector('button');
          button.click();

          setTimeout(()=>{
            const errors = [...form.querySelectorAll('.help-block')];

            assert.strictEqual(errors[0].innerText,
                emailErrorMessage,
                `Should show error 'Length must be at least ${EMAIL_MIN_LENGTH} symbols.'`);
            assert.strictEqual(errors[1].innerText,
                passwordErrorMessage,
                `Should show error 'Length must be at least ${PASSWORD_MIN_LENGTH} symbols.'`);

            done();
          });
        });
      });

  [['email', 'password'],
    ['Vladyslav', 'strong-password']]
      .forEach(([emailValue, passwordValue]) =>{
        test(`Email: ${emailValue}, Password: ${passwordValue}`, async function(assert) {
          assert.expect(1);
          const done = assert.async();

          const emailInput = form.querySelector('input#email');
          emailInput.value = emailValue;

          const passwordInput = form.querySelector('input#password');
          passwordInput.value = passwordValue;

          const button = form.querySelector('button');
          button.click();
          setTimeout(()=>{
            const errors = [...form.querySelectorAll('.help-block')];
            assert.strictEqual(errors.length, 0, 'Should pass without errors.');
            done();
          });
        });
      });
});
