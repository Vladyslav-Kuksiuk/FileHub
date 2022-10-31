import {RequestService} from '../../src/server-connection/request-service';
import {Response} from '../../src/server-connection/response';
import {
  ApiService,
  DEFAULT_ERROR,
  LOGIN_401_ERROR,
  LOG_IN_USER_PATH,
  REGISTER_USER_PATH,
} from '../../src/server-connection/api-service';
import {UserData} from '../../src/user-data';
import {jest} from '@jest/globals';

describe('ApiService', () => {
  test(`Should successfully log in`, function(done) {
    expect.assertions(4);

    const login = 'login';
    const password = 'password';

    const requestServiceMock = jest
        .spyOn(RequestService.prototype, 'postJson')
        .mockImplementation((url, body) => {
          expect(url).toBe(LOG_IN_USER_PATH);
          expect(body.username).toBe(login);
          expect(body.password).toBe(password);
          return new Promise(((resolve) => {
            resolve(new Response(200, {token: 'myToken'}));
          }));
        });

    const apiService = new ApiService(new RequestService());
    apiService.logIn(new UserData(login, password))
        .then(() => {
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });

  test(`Should fail login with error message ${DEFAULT_ERROR}`, function(done) {
    expect.assertions(2);

    const requestServiceMock = jest
        .spyOn(RequestService.prototype, 'postJson')
        .mockImplementation(() => {
          return new Promise(((resolve) => {
            resolve(new Response(400, {}));
          }));
        });

    const apiService = new ApiService(new RequestService());
    apiService.logIn(new UserData('login', 'password'))
        .catch((error) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(error.message).toBe(DEFAULT_ERROR);
          done();
        });
  });

  test(`Should fail login with error message ${LOGIN_401_ERROR}`, function(done) {
    expect.assertions(2);

    const requestServiceMock = jest
        .spyOn(RequestService.prototype, 'postJson')
        .mockImplementation(() => {
          return new Promise(((resolve) => {
            resolve(new Response(401, {}));
          }));
        });

    const apiService = new ApiService(new RequestService());
    apiService.logIn(new UserData('login', 'password'))
        .catch((error) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(error.message).toBe(LOGIN_401_ERROR);
          done();
        });
  });

  test(`Should successfully register`, function(done) {
    expect.assertions(4);

    const login = 'login';
    const password = 'password';

    const requestServiceMock = jest
        .spyOn(RequestService.prototype, 'postJson')
        .mockImplementation((url, body) => {
          expect(url).toBe(REGISTER_USER_PATH);
          expect(body.username).toBe(login);
          expect(body.password).toBe(password);
          return new Promise(((resolve) => {
            resolve(new Response(200, {token: 'myToken'}));
          }));
        });

    const apiService = new ApiService(new RequestService());
    apiService.register(new UserData(login, password))
        .then(() => {
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });

  test(`Should fail registration with error message ${DEFAULT_ERROR}`, function(done) {
    expect.assertions(2);

    const requestServiceMock = jest
        .spyOn(RequestService.prototype, 'postJson')
        .mockImplementation(() => {
          return new Promise(((resolve) => {
            resolve(
                new Response(400, {}),
            );
          }));
        });

    const apiService = new ApiService(new RequestService());
    apiService.register(new UserData('login', 'password'))
        .catch((error) => {
          expect(error.message).toBe(DEFAULT_ERROR);
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });

  test(`Should fail registration with errors in response body`, function(done) {
    expect.assertions(2);
    const errors = {
      email: 'Email error',
      password: 'Password error',
    };

    const requestServiceMock = jest
        .spyOn(RequestService.prototype, 'postJson')
        .mockImplementation(() => {
          return new Promise(((resolve) => {
            resolve(new Response(422, {errors: errors}));
          }));
        });

    const apiService = new ApiService(new RequestService());
    apiService.register(new UserData('login', 'password'))
        .catch((error) => {
          expect(error.errors).toBe(errors);
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });
});
