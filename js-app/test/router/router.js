import {Router} from '../../src/router.js';

const {module, test} = QUnit;

module('Router', () => {
  test(`redirect`, function(assert) {
    assert.expect(3);
    const done = assert.async();
    const fixture = document.getElementById('qunit-fixture');
    window.location.hash = '';

    const router = Router.getBuilder()
        .addHomeRouteName('login')
        .addErrorRoute(() => {
          fixture.innerHTML = 'error';
        })
        .addRoute('register', () => {
          fixture.innerHTML = 'register';
        })
        .addRoute('login', () => {
          fixture.innerHTML = 'login';
        }).build();

    assert.strictEqual(fixture.innerHTML, 'login',
        'Should return page innerHTML, after router creation');

    router.redirect('register');

    setTimeout(()=>{
      assert.strictEqual(fixture.innerHTML, 'register',
          'Should return page innerHTML, after redirecting to register');

      router.redirect('notExistingPage');

      setTimeout(()=>{
        assert.strictEqual(fixture.innerHTML, 'error',
            'Should return page innerHTML, after redirecting to not existing page');
        done();
      });
    });
  });
});
