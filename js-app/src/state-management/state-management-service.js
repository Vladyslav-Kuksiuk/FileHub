import {Action} from './action';
import {ApiService} from '../server-connection/api-service';

/**
 * Service to provide state management.
 */
export class StateManagementService {
  #eventTarget;
  #mutators;
  #state;
  #apiService;

  /**
   * @param {object} mutators
   * @param {object} state
   * @param {ApiService} apiService
   */
  constructor(mutators, state, apiService) {
    this.#eventTarget = new EventTarget();
    this.#apiService = apiService;
    this.#mutators = mutators || {};

    this.#state = new Proxy((state || {}), {
      set: (state, field, value) => {
        const changed = Reflect.set(state, field, value);
        if (changed) {
          this.#eventTarget.dispatchEvent(new CustomEvent(`STATE_CHANGED.${field}`, {
            detail: state,
          }));
        }
        return changed;
      },
    });
  }

  /**
   * Runs action.
   *
   * @param {Action} action
   */
  dispatch(action) {
    action.execute((mutatorKey, payload) => {
      this.#mutators[mutatorKey](this.#state, payload);
    }, this.#apiService);
  }

  /**
   * @returns {object} Immutable state.
   */
  get state() {
    return Object.freeze(Object.assign({}, this.#state));
  }

  /**
   * Adds listener to some field in state changes event.
   *
   * @param {string} fieldName
   * @param {Function} listener
   */
  addStateListener(fieldName, listener) {
    this.#eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`,
        (event) => listener(event.detail));
  }
}
