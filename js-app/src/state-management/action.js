import {ApplicationContext} from '../application-context';

/**
 *  Base Action class.
 */
export class Action {
  _payload;

  /**
   * @param {object} payload
   */
  constructor(payload = {}) {
    this._payload = payload;
  }

  /**
   * Executes an action.
   *
   * @abstract
   * @param {Function} executor
   * @param {ApplicationContext} applicationContext
   */
  execute(executor, applicationContext) {}
}
