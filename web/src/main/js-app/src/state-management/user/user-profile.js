/**
 * User profile.
 */
export class UserProfile {
  #username;
  #rootFolderId;

  /**
   * @param {string} username
   * @param {string} rootFolderId
   */
  constructor(username, rootFolderId) {
    this.#username = username;
    this.#rootFolderId = rootFolderId;
  }

  /**
   * @returns {string}
   */
  get username() {
    return this.#username;
  }

  /**
   * @returns {string}
   */
  get rootFolderId() {
    return this.#rootFolderId;
  }
}
