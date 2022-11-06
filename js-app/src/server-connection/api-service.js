import {RequestService} from './request-service';
import {FieldValidationError} from './field-validation-error';
import {Response} from './response';
import {UserData} from '../user-data';
import {ApiServiceError} from './api-service-error';

export const LOG_IN_USER_PATH = 'api/login';
export const REGISTER_USER_PATH = 'api/register';
export const LOAD_USER_PATH = 'api/user';
export const LOAD_FOLDER_INFO_PATH = 'api/folders/';
export const LOG_OUT_USER_PATH = 'api/logout';

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
    return this.#requestService.postJson(LOG_IN_USER_PATH, {
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
    return this.#requestService.postJson(REGISTER_USER_PATH, {
      username: data.login,
      password: data.password,
    }).then((response) => {
      if (response.status === 422) {
        throw new FieldValidationError(response.body.errors);
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }

  /**
   * Loads user data.
   *
   * @returns {Promise<object | Error>}
   */
  async loadUser() {
    return this.#requestService.get(LOAD_USER_PATH, this.#userToken)
        .then((response) => {
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body;
        });
  }

  /**
   * Loads folder info.
   *
   * @param {string} folderId
   * @returns {Promise<object | Error>}
   */
  async loadFolderInfo(folderId) {
    return this.#requestService.get(LOAD_FOLDER_INFO_PATH+folderId, this.#userToken)
        .then((response) => {
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body;
        });
  }

  /**
   * Log out user.
   *
   * @returns {Promise<object | Error>}
   */
  async logOut() {
    return this.#requestService.get(LOG_OUT_USER_PATH, this.#userToken)
        .then((response) => {
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body;
        });
  }
}
