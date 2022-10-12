import {
  EMAIL_LENGTH_ERROR, EMAIL_VALIDATION_ERROR,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_MATCH_ERROR,
  RegistrationForm,
} from '../../src/components/registration-form';

const {module, test} = QUnit;

module('RegistrationForm Component', () => {
  test(`RegistrationForm constructor`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="form"]').length, 0,
        'Should return number of forms before creating.');

    new RegistrationForm(fixture);

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 3,
        'Should return number of form controls after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="button-component"]').innerText, 'Sign Up',
        'Should return button innerText: Sign Up.');
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
    test(`AuthorizationForm validation, email: ${email}, password: ${password}`, function(assert) {
      assert.expect(emailErrors.length + passwordErrors.length +confirmErrors.length + 1);
      const done = assert.async();
      const fixture = document.getElementById('qunit-fixture');

      new RegistrationForm(fixture);
      fixture.querySelectorAll('[data-td="form-control"] input')[0].value = email;
      fixture.querySelectorAll('[data-td="form-control"] input')[1].value = password;
      fixture.querySelectorAll('[data-td="form-control"] input')[2].value = confirm;
      fixture.querySelector('[data-td="button-component"]').click();

      setTimeout(()=>{
        for (let i=0; i < emailErrors.length; i++ ) {
          assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]')[0]
              .querySelectorAll('[data-td="error-message"]')[i].innerText,
          emailErrors[i], `Should return error message : ${passwordErrors[i]}.`);
        }
        for (let i=0; i < passwordErrors.length; i++ ) {
          assert.strictEqual( fixture.querySelectorAll('[data-td="form-control"]')[1]
              .querySelectorAll('[data-td="error-message"]')[i].innerText,
          passwordErrors[i], `Should return error message : ${passwordErrors[i]}.`);
        }
        for (let i=0; i < confirmErrors.length; i++ ) {
          assert.strictEqual( fixture.querySelectorAll('[data-td="form-control"]')[2]
              .querySelectorAll('[data-td="error-message"]')[i].innerText,
          confirmErrors[i], `Should return error message : ${confirmErrors[i]}.`);
        }

        assert.ok(true, 'Should pass.');
        done();
      });
    });
  });
});
