import {RequestService} from './request-service';
import {RegisterError} from './register-error';
import {Response} from './response';
import {UserData} from '../user-data';

export const LOGIN_PATH = 'api/login';
export const REGISTER_PATH = 'api/register';
export const LOAD_USER_PATH = 'api/load-user';

export const LOGIN_401_ERROR = 'Invalid login or password';
export const DEFAULT_ERROR = 'An error occurred. Please try again.';

/**
 * Service to handle server request and response.
 */
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
   * Log in user.
   *
   * @param {UserData} data
   * @returns {Promise<Response>}
   */
  async logIn(data) {
    return await this.#requestService.postJson(LOGIN_PATH, {
      username: data.login,
      password: data.password,
    }).then((response) => {
      if (response.status === 401) {
        throw new Error(LOGIN_401_ERROR);
      }
      if (response.status !== 200) {
        throw new Error(DEFAULT_ERROR);
      }
      this.#userToken = response.body.token;
    });
  }

  /**
   * Registers user.
   *
   * @param {UserData} data
   * @returns {Promise<Error | RegisterError>}
   */
  async register(data) {
    return await this.#requestService.postJson(REGISTER_PATH, {
      username: data.login,
      password: data.password,
    }).then(async (response) => {
      if (response.status === 422) {
        throw new RegisterError(response.body.errors);
      }
      if (response.status !== 200) {
        throw new Error(DEFAULT_ERROR);
      }
    });
  }

  async loadUser(userId) {
    return await this.#requestService.get(LOAD_USER_PATH,{
      userId: userId
    }).then(async (response) => {
      if(response.status !== 200){
        throw new Error(DEFAULT_ERROR);
      }
      return response.body;
    })
  }
}
