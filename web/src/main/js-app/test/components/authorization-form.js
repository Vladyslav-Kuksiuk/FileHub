import {AuthorizationForm, EMAIL_LENGTH_ERROR, PASSWORD_LENGTH_ERROR} from '../../src/components/authorization-form';

const {module, test} = QUnit;

module('AuthorizationForm Component', () => {
  test(`AuthorizationForm constructor`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="form"]').length, 0,
        'Should return number of forms before creating.');

    new AuthorizationForm(fixture);

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 2,
        'Should return number of form controls after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="button-component"]').innerText, 'Sign In',
        'Should return button innerText: Sign In.');
  });

  [
    ['Email', 'Password', [], []],
    ['ema', 'password', [EMAIL_LENGTH_ERROR], []],
    ['Email', 'pass', [], [PASSWORD_LENGTH_ERROR]],
    ['ema', 'pass', [EMAIL_LENGTH_ERROR], [PASSWORD_LENGTH_ERROR]],
  ].forEach(([email, password, emailErrors, passwordErrors])=>{
    test(`AuthorizationForm validation, email: ${email}, password: ${password}`, function(assert) {
      assert.expect(emailErrors.length + passwordErrors.length + 1);
      const done = assert.async();
      const fixture = document.getElementById('qunit-fixture');

      new AuthorizationForm(fixture);
      fixture.querySelectorAll('[data-td="form-control"] input')[0].value = email;
      fixture.querySelectorAll('[data-td="form-control"] input')[1].value = password;
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

        assert.ok(true, 'Should pass.');
        done();
      });
    });
  });
});
