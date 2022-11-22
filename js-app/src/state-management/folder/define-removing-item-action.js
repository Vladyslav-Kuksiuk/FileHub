import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';

/**
 * Action to perform removing file defining.
 */
export class DefineRemovingItemAction extends Action {
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
    executor(MUTATOR_NAMES.SET_REMOVING_ITEM, this.#item);
  }
}
