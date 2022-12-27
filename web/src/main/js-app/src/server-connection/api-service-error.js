export const DEFAULT_ERROR = 'An error occurred. Please try again.';

/**
 * Api service error.
 */
export class ApiServiceError extends Error {
  /**
   * @param {string} message
   */
  constructor(message= DEFAULT_ERROR) {
    super(message);
  }
}
