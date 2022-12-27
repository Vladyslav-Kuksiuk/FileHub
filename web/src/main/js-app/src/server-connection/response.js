/**
 * Server response.
 */
export class Response {
  status;
  body;

  /**
   * @param {number} status - HTTP status.
   * @param {object} body
   */
  constructor(status, body) {
    this.status = status;
    this.body = body;
  }
}
