import {AuthorizationPage} from '../../src/components/authorization-page';
import {TitleService} from '../../src/title-service';

describe('AuthorizationPage Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`AuthorizationPage constructor`, function() {
    expect.assertions(4);

    expect(document.body.querySelectorAll('[data-td="form"]').length).toBe(0);
    new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign in to FileHub');
    expect(document.title).toBe('FileHub - Sign In');
  });

  test(`onNavigateToRegistration`, function() {
    expect.assertions(2);

    const page = new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));

    let isNavigated = false;
    page.onNavigateToRegistration(() => {
      isNavigated = true;
    });
    expect(isNavigated).toBeFalsy();
    document.body.querySelector('[data-td="link-component"]').click();
    expect(isNavigated).toBeTruthy();
  });

  test(`onNavigateToTable`, function(done) {
    expect.assertions(2);

    const page = new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));

    let isNavigated = false;
    page.onNavigateToTable(() => {
      isNavigated = true;
    });
    expect(isNavigated).toBeFalsy();
    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();

    setTimeout(()=>{
      expect(isNavigated).toBeTruthy();
      done();
    });
  });
});
