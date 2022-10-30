import {Response} from './response';

/**
 * Service to send server request and convert response.
 */
export class RequestService {
  /**
   * Sends POST request with JSON body and converts server response.
   *
   * @param {string} url
   * @param {object} body
   * @returns {Promise<Response>}
   */
  async postJson(url, body) {
    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let responseBody;
    await fetchResponse.json()
        .then((json) => {
          responseBody = json;
        });

    return new Response(fetchResponse.status, responseBody);
  }

  /**
   * Sends GET request with parameters and converts server response.
   *
   * @param {string} url
   * @param {object} params
   * @returns {Promise<Response>}
   */
  async get(url, params) {
    const fetchResponse = await fetch(url+'?'+ new URLSearchParams(params), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let responseBody;
    await fetchResponse.json()
      .then((json) => {
        responseBody = json;
      });

    return new Response(fetchResponse.status, responseBody);
  }
}
