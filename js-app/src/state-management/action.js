import {ApiService} from '../server-connection/api-service';
/**
 *  Base Action class.
 */
export class Action {
  _payload;

  /**
   * @param {object} payload
   */
  constructor(payload) {
    this._payload = payload;
  }

  /**
   * Executes an action and mutates the state.
   *
   * @abstract
   * @param {Function} executor
   * @param {ApiService} apiService
   */
  execute(executor, apiService) {

  }
}
