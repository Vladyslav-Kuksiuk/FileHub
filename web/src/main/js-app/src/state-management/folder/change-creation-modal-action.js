import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';

/**
 * Action to perform creation modal opening and closing.
 */
export class ChangeCreationModalAction extends Action {
  #isOpen;

  /**
   * @param {boolean} isOpen
   */
  constructor(isOpen) {
    super();
    this.#isOpen = isOpen;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_IS_FOLDER_CREATION_MODAL_OPEN, this.#isOpen);
  }
}
