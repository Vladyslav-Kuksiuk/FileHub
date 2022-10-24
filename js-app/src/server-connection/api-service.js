import {RequestService} from './request-service';
import {RegisterError} from './register-error';

export class ApiService {
  #requestService;
  #userToken;

  /**
   * @param {RequestService} requestService
   */
  constructor(requestService) {
    this.#requestService = requestService;
  }

  /**
   *
   * @param {UserData} data
   * @returns {Promise<string, Error>}
   */
  async login(data) {
    return await this.#requestService.post('api/login', {
      username: data.login,
      password: data.password,
    }).then((response) => {
      if (response.status === 401) {
        throw new Error('Invalid login or password');
      }
      if (!response.ok) {
        throw new Error('An error occurred. Please try again.');
      }
      response.json().then((jsonData) => {
        this.#userToken = jsonData.token;
      });
    });
  }

  /**
   *
   * @param {UserData} data
   * @returns {Promise<*>}
   */
  async register(data) {
    return await this.#requestService.post('api/register', {
      username: data.login,
      password: data.password,
    }).then(async (response) => {
      if (response.status === 422) {
        let jsonData;
        await response.json().then((json) => {
          jsonData = json;
        });
        throw new RegisterError(jsonData.errors);
      }
      if (!response.ok) {
        throw new Error('An error occurred. Please try again.');
      }
    });
  }

}
