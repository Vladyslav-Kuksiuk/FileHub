export const AUTH_TOKEN = 'auth-token';

/**
 * Service to store data between sessions.
 */
export class StorageService {
  /**
   * Puts value in storage by key.
   *
   * @param {string} key
   * @param {string} value
   */
  put(key, value) {
    window.localStorage.setItem(key, value);
  }

  /**
   * Gives value from storage by key.
   *
   * @param {string} key
   * @returns {string}
   */
  get(key) {
    return window.localStorage.getItem(key);
  }
}
