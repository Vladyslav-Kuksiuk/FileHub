/**
 * Entity to transfer user data.
 */
export class UserData {
  login;
  password;

  /**
   * @param {string} login
   * @param {string} password
   */
  constructor(login, password) {
    this.login = login;
    this.password = password;
  }
}
