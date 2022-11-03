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
   * @param {string} token
   * @returns {Promise<Response>}
   */
  async postJson(url, body, token) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(async (fetchResponse) => {
      let responseBody = {};
      if (fetchResponse.status === 200 || fetchResponse.status === 422) {
        responseBody = await fetchResponse.json();
      }
      return new Response(fetchResponse.status, responseBody);
    }).catch(()=>{
      return new Response(522, {});
    });
  }

  /**
   * Sends GET request with parameters and converts server response.
   *
   * @param {string} url
   * @param {string} token
   * @returns {Promise<Response>}
   */
  async get(url, token) {
    const fetchResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
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
