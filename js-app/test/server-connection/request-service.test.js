import {RequestService} from '../../src/server-connection/request-service';
import {jest} from '@jest/globals';

describe('RequestService', () => {
  test(`Should create and render Button component`, function(done) {
    expect.assertions(4);
    const url = 'MyUrl';
    const requestBody = {text: 'myText'};
    const responseBody = {answer: 'answer'};

    global.fetch = jest.fn(async () => {
      return await new Promise(((resolve) => {
        resolve(
            {
              status: 200,
              json: () => {
                return new Promise((resolve) => {
                  resolve(responseBody);
                });
              },
            },
        );
      }));
    });

    const requestService = new RequestService();
    const responsePromise = requestService.postJson(url, requestBody);
    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    responsePromise.then((response)=>{
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
      done();
    });
  });
});
