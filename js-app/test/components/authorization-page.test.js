import {AuthorizationPage} from '../../src/components/authorization-page';
import {TitleService} from '../../src/title-service';
import {ApiService} from '../../src/server-connection/api-service';
import {UserData} from '../../src/user-data';
import {jest} from '@jest/globals';

describe('AuthorizationPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const titleServiceMock = jest
      .spyOn(TitleService.prototype, 'setTitles')
      .mockImplementation(() => {});

  test('Should create and render AuthorizationPage component', function() {
    expect.assertions(4);

    new AuthorizationPage(document.body, new TitleService(), new ApiService());
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign in to FileHub');
    expect(titleServiceMock).toBeCalledTimes(1);
    expect(titleServiceMock).toBeCalledWith(['Sign In']);
  });

  test('Should trigger navigate to registration event', function(done) {
    expect.assertions(1);

    const page = new AuthorizationPage(document.body, new TitleService(), new ApiService());

    page.onNavigateToRegistration(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelector('[data-td="link-component"]').click();
  });

  test('Should trigger navigate to table event', function(done) {
    expect.assertions(2);

    const apiServiceMock = jest
        .spyOn(ApiService.prototype, 'logIn')
        .mockImplementation(async () => {
          return await new Promise((resolve) => {
            resolve();
          });
        });

    const page = new AuthorizationPage(document.body, new TitleService(), new ApiService());

    page.onNavigateToTable(() => {
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(apiServiceMock).toBeCalledWith(new UserData('email', 'password'));
      done();
    });
    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();
  });
});
