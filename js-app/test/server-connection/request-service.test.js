import {RequestService} from '../../src/server-connection/request-service';
import {jest} from '@jest/globals';

describe('RequestService', () => {
  test(`Should correctly send POST request and handle response`, function(done) {
    expect.assertions(4);
    const url = 'MyUrl';
    const requestBody = {text: 'myText'};
    const responseBody = {answer: 'answer'};

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          return responseBody;
        },
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.postJson(url, requestBody, token);

    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
      done();
    });
  });

  test(`Should fail POST request and handle error`, function(done) {
    expect.assertions(2);

    const errorText = 'error text';

    global.fetch = jest.fn(async () => {
      throw new Error(errorText);
    });

    const requestService = new RequestService();
    const responsePromise = requestService.postJson('myUrl', {}, 'token');

    responsePromise.then((response) => {
      expect(response.status).toBe(522);
      expect(response.body).toStrictEqual({error: errorText});
      done();
    });
  });

  test(`Should correctly send GET request and handle response`, function(done) {
    expect.assertions(4);
    const url = 'MyUrl';
    const responseBody = {answer: 'answer'};

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          return responseBody;
        },
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.get(url, token);

    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
      done();
    });
  });

  test(`Should fail GET request and handle error`, function(done) {
    expect.assertions(2);

    const errorText = 'error text';

    global.fetch = jest.fn(async () => {
      throw new Error(errorText);
    });

    const requestService = new RequestService();
    const responsePromise = requestService.get('myUrl', 'myToken');

    responsePromise.then((response) => {
      expect(response.status).toBe(522);
      expect(response.body).toStrictEqual({error: errorText});
      done();
    });
  });
});
