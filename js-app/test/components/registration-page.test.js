import {RegistrationPage} from '../../src/components/registration-page';
import {TitleService} from '../../src/title-service';
import {jest} from '@jest/globals';
import {ApiService} from '../../src/server-connection/api-service';
import {UserData} from '../../src/user-data';
import {RegistrationForm} from '../../src/components/registration-form/index';

describe('RegistrationPage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const titleServiceMock = jest
      .spyOn(TitleService.prototype, 'setTitles')
      .mockImplementation(() => {});

  test('Should create and render RegistrationPage component', function() {
    expect.assertions(4);

    new RegistrationPage(document.body, new TitleService(), new ApiService());
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign up to FileHub');
    expect(titleServiceMock).toBeCalledTimes(1);
    expect(titleServiceMock).toBeCalledWith(['Sign Up']);
  });

  test('Should trigger navigate to authorization event by clicking on link', function(done) {
    expect.assertions(1);

    const page = new RegistrationPage(document.body, new TitleService(), new ApiService());

    page.onNavigateToAuthorization(() => {
      expect(true).toBeTruthy();
      done();
    });
    document.body.querySelector('[data-td="link-component"]').click();
  });

  test('Should trigger navigate to authorization event by form submitting', function(done) {
    expect.assertions(2);

    const apiServiceMock = jest
        .spyOn(ApiService.prototype, 'register')
        .mockImplementation(async () => {});

    const page = new RegistrationPage(document.body, new TitleService(), new ApiService());

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
    expect.assertions(4);

    const apiServiceMock = jest
        .spyOn(ApiService.prototype, 'register')
        .mockImplementation( async () => {
          throw new Error('Error message');
        });

    const regFormMock = jest
        .spyOn(RegistrationForm.prototype, 'setHeadError')
        .mockImplementation(()=>{});

    new RegistrationPage(document.body, new TitleService(), new ApiService());

    document.body.querySelectorAll('[data-td="form-control"] input')[0].value = 'email';
    document.body.querySelectorAll('[data-td="form-control"] input')[1].value = 'password';
    document.body.querySelectorAll('[data-td="form-control"] input')[2].value = 'password';
    document.body.querySelector('[data-td="form-component"]').submit();

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(apiServiceMock).toBeCalledWith(new UserData('email', 'password'));
      expect(regFormMock).toBeCalledTimes(1);
      expect(regFormMock).toBeCalledWith('Error message');
      done();
    });
  });
});
