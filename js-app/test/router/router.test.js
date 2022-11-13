import {RouterConfigBuilder} from '../../src/router/router-config';
import {Router} from '../../src/router';

describe('Router', () => {
  const routerConfig = new RouterConfigBuilder()
      .addHomeRoutePath('login')
      .addErrorRoute(() => {
        document.body.textContent = 'error';
      })
      .addRoute('register', () => {
        document.body.textContent = 'register';
      })
      .addRoute('login', () => {
        document.body.textContent = 'login';
      }).build();

  test(`Should redirect to login->register->error by hash-changing`, function() {
    return new Promise((done) => {
      expect.assertions(6);

      window.location.hash = '';

      const router = new Router(routerConfig);

      expect(document.body.textContent).toBe('login');
      expect(window.location.hash).toBe('#login');

      router.redirect('register');

      setTimeout(() => {
        expect(document.body.textContent).toBe('register');
        expect(window.location.hash).toBe('#register');

        router.redirect('notExistingPage');

        setTimeout(() => {
          expect(document.body.textContent).toBe('error');
          expect(window.location.hash).toBe('#notExistingPage');
          done();
        });
      });
    });
  });

  test(`Should redirect to login->register->error by redirect`, function() {
    return new Promise((resolve) => {
      expect.assertions(3);

      window.location.hash = '';

      const router = new Router(routerConfig);

      expect(document.body.textContent).toBe('login');
      window.location.hash = '#login';

      router.redirect('register');

      setTimeout(() => {
        expect(document.body.textContent).toBe('register');

        router.redirect('notExistingPage');

        setTimeout(() => {
          expect(document.body.textContent).toBe('error');
          resolve();
        });
      });
    });
  });
});
