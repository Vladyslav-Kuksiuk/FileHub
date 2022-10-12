import {RegistrationPage} from '../../src/components/registration-page';

const {module, test} = QUnit;

module('RegistrationPage Component', () => {
  test(`RegistrationPage constructor`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="form"]').length, 0,
        'Should return number of forms before creating.');

    new RegistrationPage(fixture);
    assert.strictEqual(fixture.querySelectorAll('[data-td="form-component"]').length, 1,
        'Should return number of forms after creating.');
    assert.strictEqual(fixture.querySelector('main h1').innerText, 'Sign up to FileHub',
        'Should return h1 innerText: Sign up to FileHub.');
  });
});
