import {Action} from './action';
import {State} from './state';

type Mutators = { [name: string]: <T>(state : State, payload: T) => State};
/**
 * Service to provide state management.
 */
export class StateManagementService {
  private eventTarget;
  private readonly mutators;
  private _state;

  /**
   * @param {Mutators} mutators
   * @param {State} state
   */
  constructor(mutators : Mutators, state : State) {
    if (state == null) {
      throw new Error('Initial state is not valid');
    }
    this.eventTarget = new EventTarget();
    this.mutators = mutators;
    this._state = state;
  }

  /**
   * Runs action.
   *
   * @param {Action} action
   */
  dispatch(action : Action) {
    action.execute((mutatorKey: string, payload: object | string | boolean | null) => {
      const newState = this.mutators[mutatorKey](this._state, payload);
      const clonedState = this._state;
      this._state = newState;
      Object.entries(newState).forEach(([field]) => {
        if (clonedState[field as keyof State] !== newState[field as keyof State]) {
          this.eventTarget.dispatchEvent(new CustomEvent(`STATE_CHANGED.${field}`, {
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
    return this._state;
  }

  /**
   * Adds listener to some field in the state change event.
   *
   * @param {string} fieldName
   * @param {function(State) : void} listener
   * @returns {{field: string, listener: function(State): void}}
   */
  addStateListener(fieldName : string, listener : (state: State)=>void) {
    listener(this._state);
    const detailedListener = (event : CustomEvent) : void => listener(event.detail);
    this.eventTarget.addEventListener(`STATE_CHANGED.${fieldName}`, <EventListener>detailedListener);
    return {
      field: fieldName,
      listener: detailedListener};
  }

  /**
   * Removes listener from some field in the state change event.
   *
   * @param {string} fieldName
   * @param {function(State): void} listener
   */
  removeStateListener(fieldName: string, listener: EventListener) {
    this.eventTarget.removeEventListener(`STATE_CHANGED.${fieldName}`, listener);
  }
}
