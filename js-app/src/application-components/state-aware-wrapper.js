import {State} from '../state-management/state';
import {StateManagementService} from '../state-management/state-management-service';

/**
 * Base wrapper class to work with {@link StateManagementService}.
 */
class StateAwareWrapper {
  #stateManagementService;
  #stateListeners = [];

  /**
   * @param {StateManagementService} stateManagementService
   */
  constructor(stateManagementService) {
    this.#stateManagementService = stateManagementService;
  }

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
