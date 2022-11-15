import {Action} from './action';
import {State} from './state';

/**
 * Service to provide state management.
 */
export class StateManagementService {
  #eventTarget;
  #mutators;
  #state;

  /**
   * @param {object} mutators
   * @param {State} state
   */
  constructor(mutators, state) {
    if (state == null) {
      throw new Error('Initial state is not valid');
    }
    this.#eventTarget = new EventTarget();
    this.#mutators = mutators || {};
    this.#state = state;
  }

  /**
   * Runs action.
   *
   * @param {Action} action
   */
  dispatch(action) {
    action.execute((mutatorKey, payload) => {
      const newState = this.#mutators[mutatorKey](this.#state, payload);
      const clonedState = this.state;
      this.#state = newState;
      Object.entries(newState).forEach(([field]) => {
        if (clonedState[field] !== newState[field]) {
          this.#eventTarget.dispatchEvent(new CustomEvent(`STATE_CHANGED.${field}`, {
            detail: newState,
          }));
        }
      });
    });
  }

  /**
   * @returns {State} Immutable state.
   */
  get state() {
    return this.#state;
  }

  /**
   * Adds listener to some field in state changes' event.
   *
   * @param {string} fieldName
   * @param {function(State)} listener
   */
  addStateListener(fieldName, listener) {
    listener(this.state);
    this.#eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`,
        (event) => listener(event.detail));
  }
}
