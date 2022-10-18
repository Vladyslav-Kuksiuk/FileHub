import {AuthorizationPage} from '../../src/components/authorization-page';
import {TitleService} from '../../src/title-service.js';

const {module, test} = QUnit;

module('AuthorizationPage Component', () => {
  test(`AuthorizationPage constructor`, function(assert) {
    assert.expect(4);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="form"]').length, 0,
        'Should return number of forms before creating.');

    new AuthorizationPage(fixture, new TitleService('FileHub', ' - '));
    assert.strictEqual(fixture.querySelectorAll('[data-td="form-component"]').length, 1,
        'Should return number of forms after creating.');
    assert.strictEqual(fixture.querySelector('main h1').innerText, 'Sign in to FileHub',
        'Should return h1 innerText: Sign In to FileHub.');
    assert.strictEqual(document.title, 'FileHub - Sign In',
        'Should return document title: FileHub - Sign In.');
  });
});
