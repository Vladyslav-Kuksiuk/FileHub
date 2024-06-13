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
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    try {
      return new Response(response.status, await response.json());
    } catch (e) {
      return new Response(response.status);
    }
  }

  /**
   * Sends POST request with {@link FormData} and converts server response.
   *
   * @param {string} url
   * @param {FormData} formData
   * @param {string} token
   * @returns {Promise<Response>}
   */
  async postFormData(url, formData, token) {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });

    try {
      return new Response(response.status, await response.json());
    } catch (e) {
      return new Response(response.status);
    }
  }

  /**
   * Sends GET request and converts server response.
   *
   * @param {string} url
   * @param {string} token
   * @returns {Promise<Response>}
   */
  async get(url, token) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    try {
      return new Response(response.status, await response.json());
    } catch (e) {
      return new Response(response.status);
    }
  }

  /**
   * Sends DELETE request and converts server response.
   *
   * @param {string} url
   * @param {string} token
   * @returns {Promise<Response>}
   */
  async delete(url, token) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    return new Response(response.status);
  }
}
