import {AuthorizationPage} from '../../src/components/authorization-page';
import {TitleService} from '../../src/title-service';

describe('AuthorizationPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should create and render AuthorizationPage component`, function() {
    expect.assertions(3);

    new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign in to FileHub');
    expect(document.title).toBe('FileHub - Sign In');
  });

  test(`Should trigger onNavigateToRegistration event`, function(done) {
    expect.assertions(1);

    const page = new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));

    page.onNavigateToRegistration(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelector('[data-td="link-component"]').click();
  });

  test(`Should trigger onNavigateToTable event`, function(done) {
    expect.assertions(1);

    const page = new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));

    page.onNavigateToTable(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();
  });
});
