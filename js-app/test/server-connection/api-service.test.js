import {RequestService} from '../../src/server-connection/request-service';
import {Response} from '../../src/server-connection/response';
import {
  ApiService,
  LOGIN_401_ERROR,
  LOG_IN_USER_PATH,
  REGISTER_USER_PATH,
} from '../../src/server-connection/api-service';
import {DEFAULT_ERROR} from '../../src/server-connection/api-service-error';
import {UserData} from '../../src/user-data';
import {jest} from '@jest/globals';

describe('ApiService', () => {
  test(`Should successfully log in`, function(done) {
    expect.assertions(4);

    const login = 'login';
    const password = 'password';

    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'postJson')
        .mockImplementation( async (url, body) => {
          expect(url).toBe(LOG_IN_USER_PATH);
          expect(body.username).toBe(login);
          expect(body.password).toBe(password);
          return new Response(200, {token: 'myToken'});
        });

    const apiService = new ApiService(requestService);
    apiService.logIn(new UserData(login, password))
        .then(() => {
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });

  test(`Should fail login with error message ${DEFAULT_ERROR}`, function(done) {
    expect.assertions(2);

    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'postJson')
        .mockImplementation(async () => {
          return new Response(400, {});
        });

    const apiService = new ApiService(requestService);
    apiService.logIn(new UserData('login', 'password'))
        .catch((error) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(error.message).toBe(DEFAULT_ERROR);
          done();
        });
  });

  test(`Should fail login with error message ${LOGIN_401_ERROR}`, function(done) {
    expect.assertions(2);

    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'postJson')
        .mockImplementation(async () => {
          return new Response(401, {});
        });

    const apiService = new ApiService(requestService);
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
    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'postJson')
        .mockImplementation(async (url, body) => {
          expect(url).toBe(REGISTER_USER_PATH);
          expect(body.username).toBe(login);
          expect(body.password).toBe(password);
          return new Response(200, {token: 'myToken'});
        });

    const apiService = new ApiService(requestService);
    apiService.register(new UserData(login, password))
        .then(() => {
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });

  test(`Should fail registration with error message ${DEFAULT_ERROR}`, function(done) {
    expect.assertions(2);

    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'postJson')
        .mockImplementation(async () => {
          return new Response(400, {});
        });

    const apiService = new ApiService(requestService);
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

    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'postJson')
        .mockImplementation(async () => {
          return new Response(422, {errors: errors});
        });

    const apiService = new ApiService(requestService);
    apiService.register(new UserData('login', 'password'))
        .catch((error) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(error.fieldErrors).toBe(errors);
          done();
        });
  });

  test(`Should successfully logOut`, function(done) {
    expect.assertions(1);
    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'get')
        .mockImplementation(async () => {
          return new Response(200, {});
        });

    const apiService = new ApiService(requestService);
    apiService.logOut()
        .then(() => {
          expect(requestServiceMock).toBeCalledTimes(1);
          done();
        });
  });

  test(`Should fail logOut`, function(done) {
    expect.assertions(2);
    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'get')
        .mockImplementation(async () => {
          return new Response(405, {});
        });

    const apiService = new ApiService(requestService);
    apiService.logOut()
        .catch((error) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(error.message).toBe(DEFAULT_ERROR);
          done();
        });
  });

  test(`Should successfully load user`, function(done) {
    expect.assertions(2);
    const requestService = new RequestService();
    const username = 'test user';

    const requestServiceMock = jest
        .spyOn(requestService, 'get')
        .mockImplementation(async () => {
          return new Response(200, {
            username: username,
          });
        });

    const apiService = new ApiService(requestService);
    apiService.loadUser()
        .then((userdata) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(userdata.username).toBe(username);
          done();
        });
  });

  test(`Should fail loadUser`, function(done) {
    expect.assertions(2);
    const requestService = new RequestService();

    const requestServiceMock = jest
        .spyOn(requestService, 'get')
        .mockImplementation(async () => {
          return new Response(405, {});
        });

    const apiService = new ApiService(requestService);
    apiService.loadUser()
        .catch((error) => {
          expect(requestServiceMock).toBeCalledTimes(1);
          expect(error.message).toBe(DEFAULT_ERROR);
          done();
        });
  });
});
