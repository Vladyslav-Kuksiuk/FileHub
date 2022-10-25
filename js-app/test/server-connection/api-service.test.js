import {RequestService} from '../../src/server-connection/request-service';
import {ApiService, DEFAULT_ERROR, LOGIN_401_ERROR} from '../../src/server-connection/api-service';
import {UserData} from '../../src/user-data';
import {jest} from '@jest/globals';
import 'isomorphic-fetch';

describe('ApiService', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should successfully log in`, function(done) {
    expect.assertions(1);

    const requestServiceMock = jest
      .spyOn(RequestService.prototype, 'post')
      .mockImplementation(() => {
        return new Promise(((resolve) => {
          resolve(
            new Response(JSON.stringify({
              token: 'testToken',
            }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }));
        }));
      });

    const apiService = new ApiService(new RequestService());
    apiService.logIn(new UserData('login', 'password'))
      .then(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  test(`Should fail log in with error message ${DEFAULT_ERROR}`, function(done) {
    expect.assertions(1);

    const requestServiceMock = jest
      .spyOn(RequestService.prototype, 'post')
      .mockImplementation(() => {
        return new Promise(((resolve) => {
          resolve(
            new Response(JSON.stringify({
              token: 'testToken',
            }), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            }));
        }));
      });

    const apiService = new ApiService(new RequestService());
    apiService.logIn(new UserData('login', 'password'))
      .catch((error) => {
        expect(error.message).toBe(DEFAULT_ERROR);
        done()
      });
  });

  test(`Should fail log in with error message ${LOGIN_401_ERROR}`, function(done) {
    expect.assertions(1);

    const requestServiceMock = jest
      .spyOn(RequestService.prototype, 'post')
      .mockImplementation(() => {
        return new Promise(((resolve) => {
          resolve(
            new Response(JSON.stringify({
              token: 'testToken',
            }), {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
              },
            }));
        }));
      });

    const apiService = new ApiService(new RequestService());
    apiService.logIn(new UserData('login', 'password'))
      .catch((error) => {
        expect(error.message).toBe(LOGIN_401_ERROR);
        done()
      });
  });

});
