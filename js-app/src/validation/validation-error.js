/**
 * Input validation error holder.
 */
export class ValidationError extends Error {
  name;
  message;

  /**
   * @param {string} name
   * @param {string} message
   */
  constructor(name, message) {
    super();
    this.name = name;
    this.message = message;
  }
}
