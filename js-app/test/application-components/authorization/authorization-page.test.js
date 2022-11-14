import {AuthorizationPage} from '../../../src/application-components/authorization/authorization-page';
import {UserData} from '../../../src/user-data';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';

describe('AuthorizationPage', () => {
  let applicationContext;
  let titleServiceMock;

  beforeEach(() => {
    document.body.innerHTML = '';

    applicationContext = new ApplicationContext();

    titleServiceMock = jest
        .spyOn(applicationContext.titleService, 'setTitles')
        .mockImplementation(() => {});
  });

  test('Should create and render AuthorizationPage component', function() {
    expect.assertions(4);

    new AuthorizationPage(document.body, applicationContext);
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign in to FileHub');
    expect(titleServiceMock).toHaveBeenCalledTimes(1);
    expect(titleServiceMock).toHaveBeenCalledWith(['Sign In']);
  });

  test('Should trigger navigate to registration event', function() {
    return new Promise((done) => {
      expect.assertions(1);

      const page =
      new AuthorizationPage(document.body, applicationContext);

      page.onNavigateToRegistration(() => {
        expect(true).toBeTruthy();
        done();
      });
      document.body.querySelector('[data-td="link-component"]').click();
    });
  });

  test('Should trigger navigate to table event', function() {
    return new Promise((done) => {
      expect.assertions(2);

      const apiServiceMock = jest
          .spyOn(applicationContext.apiService, 'logIn')
          .mockImplementation(async () => {});

      const page =
      new AuthorizationPage(document.body, applicationContext);

      page.onNavigateToTable(() => {
        expect(apiServiceMock).toHaveBeenCalledTimes(1);
        expect(apiServiceMock).toHaveBeenCalledWith(new UserData('email', 'password'));
        done();
      });
      document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
      document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
      document.body.querySelector('[data-td="form-component"]').submit();
    });
  });

  test('Should set headError', function() {
    return new Promise((done) => {
      expect.assertions(3);

      const apiServiceMock = jest
          .spyOn(applicationContext.apiService, 'logIn')
          .mockImplementation(async () => {
            throw new Error('Error message');
          });

      new AuthorizationPage(document.body, applicationContext);

      document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
      document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
      document.body.querySelector('[data-td="form-component"]').submit();

      setTimeout(()=>{
        expect(apiServiceMock).toHaveBeenCalledTimes(1);
        expect(apiServiceMock).toHaveBeenCalledWith(new UserData('email', 'password'));
        expect(document.body.querySelector('[data-td="head-error"] p').textContent).toMatch('Error message');
        done();
      });
    });
  });
});
