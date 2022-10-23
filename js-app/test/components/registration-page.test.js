import {RegistrationPage} from '../../src/components/registration-page';
import {TitleService} from '../../src/title-service';

describe('RegistrationPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Should create and render RegistrationPage component', function() {
    expect.assertions(3);

    new RegistrationPage(document.body, new TitleService('FileHub', ' - '));
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign up to FileHub');
    expect(document.title).toBe('FileHub - Sign Up');
  });

  test('Should trigger navigate to authorization event by clicking on link', function(done) {
    expect.assertions(1);

    const page = new RegistrationPage(document.body, new TitleService('FileHub', ' - '));

    page.onNavigateToAuthorization(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelector('[data-td="link-component"]').click();
  });

  test('Should trigger navigate to authorization event by form submitting', function(done) {
    expect.assertions(1);

    const page = new RegistrationPage(document.body, new TitleService('FileHub', ' - '));

    page.onNavigateToAuthorization(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelectorAll('[data-td="form-control"] input')[2].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();
  });
});
