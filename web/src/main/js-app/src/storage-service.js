export const AUTH_TOKEN = 'auth-token';
export const EMAIL_ADDRESS = 'email-address';

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

  /**
   * Clears storage.
   */
  clear() {
    window.localStorage.clear();
  }
}
