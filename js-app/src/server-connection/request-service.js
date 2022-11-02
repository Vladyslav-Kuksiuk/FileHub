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
    return fetch(url, {
      method: 'POST',
      headers: {
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
}
