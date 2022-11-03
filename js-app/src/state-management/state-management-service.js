import {Action} from './action';
import {ApplicationContext} from '../application-context';

/**
 * Service to provide state management.
 */
export class StateManagementService {
  #eventTarget;
  #mutators;
  #state;
  #applicationContext;

  /**
   * @param {object} mutators
   * @param {object} state
   * @param {ApplicationContext} applicationContext
   */
  constructor(mutators, state, applicationContext) {
    this.#eventTarget = new EventTarget();
    this.#mutators = mutators || {};
    this.#state = state;
    this.#applicationContext = applicationContext;
  }

  /**
   * Runs action.
   *
   * @param {Action} action
   */
  dispatch(action) {
    action.execute((mutatorKey, payload) => {
      const newState = this.#mutators[mutatorKey](this.#state, payload);
      Object.entries(newState).forEach(([field]) => {
        if (this.#state[field] !== newState[field]) {
          this.#state = newState;
          this.#eventTarget.dispatchEvent(new CustomEvent(`STATE_CHANGED.${field}`, {
            detail: newState,
          }));
        }
      });
    }, this.#applicationContext);
  }

  /**
   * @returns {object} Immutable state.
   */
  get state() {
    return Object.freeze(Object.assign({}, this.#state));
  }

  /**
   * Adds listener to some field in state changes' event.
   *
   * @param {string} fieldName
   * @param {Function} listener
   */
  addStateListener(fieldName, listener) {
    this.#eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`,
        (event) => listener(event.detail));
  }
}
