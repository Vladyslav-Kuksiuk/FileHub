import {RegistrationPage} from '../../src/components/registration-page';
import {TitleService} from '../../src/title-service';

describe('RegistrationPage Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`RegistrationPage constructor`, function() {
    expect.assertions(3);

    new RegistrationPage(document.body, new TitleService('FileHub', ' - '));
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign up to FileHub');
    expect(document.title).toBe('FileHub - Sign Up');
  });

  test(`onNavigateToAuthorization(by link)`, function() {
    expect.assertions(2);

    const page = new RegistrationPage(document.body, new TitleService('FileHub', ' - '));

    let isNavigated = false;
    page.onNavigateToAuthorization(() => {
      isNavigated = true;
    });
    expect(isNavigated).toBeFalsy();
    document.body.querySelector('[data-td="link-component"]').click();
    expect(isNavigated).toBeTruthy();
  });

  test(`onNavigateToAuthorization(by success form submit)`, function(done) {
    expect.assertions(2);

    const page = new RegistrationPage(document.body, new TitleService('FileHub', ' - '));

    let isNavigated = false;
    page.onNavigateToAuthorization(() => {
      isNavigated = true;
    });
    expect(isNavigated).toBeFalsy();
    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelectorAll('[data-td="form-control"] input')[2].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();

    setTimeout(()=>{
      expect(isNavigated).toBeTruthy();
      done();
    });
  });
});
