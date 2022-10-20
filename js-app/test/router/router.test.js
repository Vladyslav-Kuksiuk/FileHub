import {Router} from '../../src/router';
import {RouterConfigBuilder} from '../../src/router/router-config.js';

describe('Router', () => {
  test(`redirect`, function(done) {
    expect.assertions(3);

    window.location.hash = '';

    const routerConfig = new RouterConfigBuilder()
    addHomeRouteName('login')
      .addErrorRoute((slot) => {
        document.body.textContent = 'error';
      })
      .addRoute('register', (slot) => {
        document.body.textContent = 'register';
      })
      .addRoute('login', (slot) => {
        document.body.textContent = 'login';
      }).build();

    const router = new Router(routerConfig)

    expect(document.body.textContent).toBe('login');

    router.redirect('register');

    setTimeout(()=>{
      expect(document.body.textContent).toBe('register');

      router.redirect('notExistingPage');

      setTimeout(()=>{
        expect(document.body.textContent).toBe('error');
        done();
      });
    });
  });
});
