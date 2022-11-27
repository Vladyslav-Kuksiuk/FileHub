import {State} from '../state-management/state';
import {inject} from '../registry';

/**
 * Base wrapper class to work with {@link StateManagementService}.
 */
export class StateAwareWrapper {
  @inject #stateManagementService;
  #stateListeners = [];

  /**
   * Adds state listener.
   *
   * @param {string} field
   * @param {function(State): void} listener
   */
  addStateListener(field, listener) {
    this.#stateListeners.push(this.#stateManagementService.addStateListener(field, listener));
  }

  /**
   * Deletes all created state listeners.
   */
  removeStateListeners() {
    this.#stateListeners.forEach((stateListener) => {
      this.#stateManagementService.removeStateListener(stateListener.field, stateListener.listener);
    });
  }
}
