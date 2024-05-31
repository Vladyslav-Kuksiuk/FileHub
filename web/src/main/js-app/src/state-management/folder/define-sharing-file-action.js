import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';

/**
 * Action to perform sharing file defining.
 */
export class DefineSharingFileAction extends Action {
  #item;

  /**
   * @param {FolderContentItem} item
   */
  constructor(item) {
    super();
    this.#item = item;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_SHARING_FILE, this.#item);
  }
}
