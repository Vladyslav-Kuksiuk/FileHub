export class StateManagementService {
  #eventTarget;
  #mutators;
  #state;

  constructor(mutators, state) {
    this.#eventTarget = new EventTarget();
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
   * @private
   */
  #mutate(mutatorKey, payload) {
    if (typeof this.#mutators[mutatorKey] !== 'function') {
      return false;
    }

    const newState = this.#mutators[mutatorKey](this.#state, payload);
    this.#state = Object.assign(this.#state, newState);

    return true;
  }

  dispatch(action) {
    return action.execute((mutatorKey, payload) => {
      this.#mutate(mutatorKey, payload);
    });
  }

  get state() {
    return Object.freeze(Object.assign({}, this.#state));
  }

  addStateListener(fieldName, listener) {
    this.#eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`,
        (event) => listener(event.detail));
  }
}
