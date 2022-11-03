import {RegistrationPage} from '../../src/components/registration-page';
import {jest} from '@jest/globals';
import {UserData} from '../../src/user-data';
import {ApplicationContext} from '../../src/application-context';

describe('RegistrationPage', () => {
  let applicationContext;
  let titleServiceMock;

  beforeEach(() => {
    document.body.innerHTML = '';

    applicationContext = new ApplicationContext();

    titleServiceMock = jest
        .spyOn(applicationContext.titleService, 'setTitles')
        .mockImplementation(() => {});
  });

  test('Should create and render RegistrationPage component', function() {
    expect.assertions(4);

    new RegistrationPage(document.body, applicationContext.apiService, applicationContext.titleService);
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign up to FileHub');
    expect(titleServiceMock).toBeCalledTimes(1);
    expect(titleServiceMock).toBeCalledWith(['Sign Up']);
  });

  test('Should trigger navigate to authorization event by clicking on link', function(done) {
    expect.assertions(1);

    const page = new RegistrationPage(document.body, applicationContext.apiService, applicationContext.titleService);

    page.onNavigateToAuthorization(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelector('[data-td="link-component"]').click();
  });

  test('Should trigger navigate to authorization event by form submitting', function(done) {
    expect.assertions(2);

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'register')
        .mockImplementation(async () => {});

    const page = new RegistrationPage(document.body, applicationContext.apiService, applicationContext.titleService);

    page.onNavigateToAuthorization(() => {
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(apiServiceMock).toBeCalledWith(new UserData('email', 'password'));
      done();
    });
    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelectorAll('[data-td="form-control"] input')[2].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();
  });

  test('Should set headError ', function(done) {
    expect.assertions(3);

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'register')
        .mockImplementation( async () => {
          throw new Error('Error message');
        });

    new RegistrationPage(document.body, applicationContext.apiService, applicationContext.titleService);

    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelectorAll('[data-td="form-control"] input')[2].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(apiServiceMock).toBeCalledWith(new UserData('email', 'password'));
      expect(document.body.querySelector('[data-td="head-error"] p').textContent).toMatch('Error message');
      done();
    });
  });
});
