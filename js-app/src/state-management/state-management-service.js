export class StateManagementService {
  #eventTarget;
  #mutators;
  #state;
  #apiService;

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
   * @param mutatorKey
   * @param payload
   * @private
   */
  #mutate(mutatorKey, payload) {
    if (typeof this.#mutators[mutatorKey] !== 'function') {
      return false;
    }
    this.#mutators[mutatorKey](this.#state, payload);

    return true;
  }

  dispatch(action) {
    return action.execute((mutatorKey, payload) => {
      this.#mutate(mutatorKey, payload);
    }, this.#apiService);
  }

  get state() {
    return Object.freeze(Object.assign({}, this.#state));
  }

  addStateListener(fieldName, listener) {
    this.#eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`,
        (event) => listener(event.detail));
  }
}
