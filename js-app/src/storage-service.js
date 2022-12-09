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
   * Gets value from storage by key.
   *
   * @param {string} key
   * @returns {string}
   */
  get(key) {
    return window.localStorage.getItem(key);
  }
}
