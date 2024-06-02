export const DEFAULT_ERROR = 'An error occurred. Please try again.';

/**
 * Api service error.
 */
export class ApiServiceError extends Error {

  #statusCode
  /**
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message= DEFAULT_ERROR, statusCode = 500) {
    super(message);
    this.#statusCode = statusCode
  }

  statusCode() {
    return this.#statusCode;
  }
}
