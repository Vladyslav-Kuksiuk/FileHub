import {RequestService} from '../../src/server-connection/request-service';
import {jest} from '@jest/globals';

describe('RequestService', () => {
  test(`Should correctly send POST request and handle response with json body`, function() {
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

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
    });
  });

  test(`Should correctly send POST request and handle response without json body`, function() {
    expect.assertions(4);
    const url = 'MyUrl';
    const requestBody = {text: 'myText'};

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          throw new Error();
        },
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.postJson(url, requestBody, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });

  test(`Should fail POST request and handle error`, function() {
    expect.assertions(1);

    global.fetch = jest.fn(async () => {
      throw new Error();
    });

    const requestService = new RequestService();
    const responsePromise = requestService.postJson('myUrl', {}, 'token');

    return expect(responsePromise).rejects.toThrow(Error);
  });

  test(`Should correctly send PUT request and handle response with json body`, function() {
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
    const responsePromise = requestService.put(url, requestBody, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
    });
  });

  test(`Should correctly send PUT request and handle response without json body`, function() {
    expect.assertions(4);
    const url = 'MyUrl';
    const requestBody = {text: 'myText'};

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          throw new Error();
        },
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.put(url, requestBody, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });

  test(`Should fail PUT request and handle error`, function() {
    expect.assertions(1);

    global.fetch = jest.fn(async () => {
      throw new Error();
    });

    const requestService = new RequestService();
    const responsePromise = requestService.put('myUrl', {}, 'token');

    return expect(responsePromise).rejects.toThrow(Error);
  });

  test(`Should correctly send PUT request with FormData and handle response with json body`, function() {
    expect.assertions(4);
    const url = 'MyUrl';
    const requestBody = new FormData();
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
    const responsePromise = requestService.postFormData(url, requestBody, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: requestBody,
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
    });
  });

  test(`Should correctly send POST request with FormData and handle response without json body`, function() {
    expect.assertions(4);
    const url = 'MyUrl';
    const requestBody = new FormData();

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          throw new Error();
        },
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.postFormData(url, requestBody, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: requestBody,
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });

  test(`Should fail POST request with FormData and handle error`, function() {
    expect.assertions(1);

    global.fetch = jest.fn(async () => {
      throw new Error();
    });

    const requestService = new RequestService();
    const responsePromise = requestService.postFormData('myUrl', {}, 'token');

    return expect(responsePromise).rejects.toThrow(Error);
  });

  test(`Should correctly send GET request and handle response with json body`, function() {
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

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBe(responseBody);
    });
  });

  test(`Should correctly send GET request and handle response without json body`, function() {
    expect.assertions(4);
    const url = 'MyUrl';

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
        json: async () => {
          throw new Error();
        },
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.get(url, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });

  test(`Should fail GET request and handle error`, function() {
    expect.assertions(1);

    global.fetch = jest.fn(async () => {
      throw new Error();
    });

    const requestService = new RequestService();
    const responsePromise = requestService.get('myUrl', 'myToken');

    return expect(responsePromise).rejects.toThrow(Error);
  });

  test('Should correctly send DELETE request  and handle response', function() {
    const url = 'MyUrl';

    global.fetch = jest.fn(async () => {
      return {
        status: 200,
      };
    });

    const requestService = new RequestService();
    const token = 'myToken';
    const responsePromise = requestService.delete(url, token);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    return responsePromise.then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
