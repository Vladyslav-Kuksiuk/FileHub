import {RequestService} from './request-service';
import {FieldValidationError} from './field-validation-error';
import {Response} from './response';
import {UserData} from '../user-data';
import {ApiServiceError} from './api-service-error';

export const LOGIN_PATH = 'api/login';
export const REGISTER_PATH = 'api/register';

export const LOGIN_401_ERROR = 'Invalid login or password';

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
    return this.#requestService.postJson(LOGIN_PATH, {
      username: data.login,
      password: data.password,
    }).then((response) => {
      if (response.status === 401) {
        throw new ApiServiceError(LOGIN_401_ERROR);
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      this.#userToken = response.body.token;
    });
  }

  /**
   * Registers user.
   *
   * @param {UserData} data
   * @returns {Promise<Error | FieldValidationError>}
   */
  async register(data) {
    return this.#requestService.postJson(REGISTER_PATH, {
      username: data.login,
      password: data.password,
    }).then(async (response) => {
      if (response.status === 422) {
        throw new FieldValidationError(response.body.errors);
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }
}
