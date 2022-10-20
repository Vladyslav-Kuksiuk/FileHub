import {Router} from '../../src/router';

describe('Router', () => {
  test(`redirect`, function(done) {
    expect.assertions(3);

    window.location.hash = '';

    const router = Router.getBuilder()
        .addHomeRouteName('login')
        .addErrorRoute((slot) => {
          document.body.textContent = 'error';
        })
        .addRoute('register', (slot) => {
          document.body.textContent = 'register';
        })
        .addRoute('login', (slot) => {
          document.body.textContent = 'login';
        }).build();

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
