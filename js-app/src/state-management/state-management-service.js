import {Action} from './action';
import {ApplicationContext} from '../application-context';
import {UserProfile} from './user/user-profile';

/**
 * Service to provide state management.
 */
export class StateManagementService {
  #eventTarget;
  #mutators;
  #state;
  #applicationContext;

  /**
   * @typedef {object} State
   * @property {boolean} isUserProfileLoading
   * @property {boolean} isFolderLoading
   * @property {UserProfile} userProfile
   * @property {string} userProfileError
   * @property {string} folderError
   * @property {string} folderInfo
   */

  /**
   * @param {object} mutators
   * @param {State} state
   * @param {ApplicationContext} applicationContext
   */
  constructor(mutators, state, applicationContext) {
    if (state == null || state === {}) {
      throw new Error('Initial state is not valid ');
    }
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
   * @returns {State} Immutable state.
   */
  get state() {
    return this.#deepFreeze(Object.assign({}, this.#state));
  }

  /**
   * @param {object} object
   * @returns {object} Immutable.
   * @private
   */
  #deepFreeze(object) {
    const propNames = Object.getOwnPropertyNames(object);

    for (const name of propNames) {
      const value = object[name];

      if (value && typeof value === 'object') {
        this.#deepFreeze(value);
      }
    }

    return Object.freeze(object);
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
