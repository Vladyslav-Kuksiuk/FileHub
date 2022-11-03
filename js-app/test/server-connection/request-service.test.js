import {RequestService} from '../../src/server-connection/request-service';
import {jest} from '@jest/globals';

describe('RequestService', () => {
  test(`Should correctly send request and handle response`, function(done) {
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
});
