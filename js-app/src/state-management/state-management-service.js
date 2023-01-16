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
   * Adds listener to some field in the state change event.
   *
   * @param {string} fieldName
   * @param {function(State)} listener
   * @returns {{field: string, listener: (function(Event))}}
   */
  addStateListener(fieldName, listener) {
    listener(this.state);
    const detailedListener = (event) => listener(event.detail);
    this.#eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`, detailedListener);
    return {
      field: fieldName,
      listener: detailedListener};
  }

  /**
   * Removes listener from some field in the state change event.
   *
   * @param {string} fieldName
   * @param {function(Event)} listener
   */
  removeStateListener(fieldName, listener) {
    this.#eventTarget.removeEventListener(`STATE_CHANGED.${fieldName}`, listener);
  }
}
