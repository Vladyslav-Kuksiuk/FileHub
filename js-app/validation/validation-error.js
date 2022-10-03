/**
 * Input validation error holder.
 */
export class ValidationError {
  name;
  message;

  /**
   * @param {string} name
   * @param {string} message
   */
  constructor(name, message) {
    this.name = name;
    this.message = message;
  }
}
