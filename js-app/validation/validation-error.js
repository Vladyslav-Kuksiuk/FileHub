/**
 * Input validation error holder.
 */
export class ValidationError {
  name;
  message;

  /**
   * ValidationError constructor
   * @param {string} name
   * @param {string} message
   */
  constructor(name, message) {
    this.name = name;
    this.message = message;
  }
}
