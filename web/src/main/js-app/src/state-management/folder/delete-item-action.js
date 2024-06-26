import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';
import {LoadFolderContentAction} from './load-folder-content-action';
import {inject} from '../../registry';

/**
 * Action to perform item deleting.
 */
export class DeleteItemAction extends Action {
  #item;
  @inject apiService;
  @inject stateManagementService;

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
    executor(MUTATOR_NAMES.SET_IS_ITEM_DELETING, true);

    return this.apiService
        .deleteItem(this.#item)
        .then(() => {
          executor(MUTATOR_NAMES.SET_REMOVING_ITEM, null);
          this.stateManagementService.dispatch(
              new LoadFolderContentAction(this.stateManagementService.state.folderInfo.id));
        })
        .catch((error) => {
          executor(MUTATOR_NAMES.SET_ITEM_DELETING_ERROR, error.message);
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_IS_ITEM_DELETING, false);
        });
  }
}
