import {StateManagementService} from './state-management-service';
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
   * @param {StateManagementService} stateManagementService
   */
  execute(executor, stateManagementService) {}
}
