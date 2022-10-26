import {Response} from './response';

export class RequestService {
  /**
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
}
