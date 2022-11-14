import {Action} from './action';
import {MUTATOR_NAMES} from './mutators';

/**
 * Action to perform location changing.
 */
export class ChangeLocationAction extends Action {
  #location;

  /**
   * @param {string} location
   */
  constructor(location) {
    super();
    this.#location = location;
  }

  /**
   * @inheritDoc
   */
  execute(executor, applicationContext) {
    executor(MUTATOR_NAMES.SET_LOCATION_FOLDER_ID, this.#location);
  }
}
