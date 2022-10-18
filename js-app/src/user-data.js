/**
 * Entity to transfer user data.
 */
export class UserData {
  #login;
  #password;

  /**
   * @param {string} login
   * @param {string} password
   */
  constructor(login, password) {
    this.#login = login;
    this.#password = password;
  }

  /**
   * @returns {string}
   */
  get login() {
    return this.#login;
  }

  /**
   * @returns {string}
   */
  get password() {
    return this.#password;
  }
}
