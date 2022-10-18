/**
 * Entity to transfer authorization form data.
 */
export class AuthorizationFormData {
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
