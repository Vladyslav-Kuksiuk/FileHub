import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';
import {LoadFolderContentAction} from './load-folder-content-action';
import {inject} from "../../registry";

/**
 * Action to perform item deleting.
 */
export class DeleteItemAction extends Action {
  #item;
  @inject #apiService;

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
  execute(executor, stateManagementService) {
    executor(MUTATOR_NAMES.SET_IS_ITEM_DELETING, true);

    return this.#apiService
        .deleteItem(this.#item)
        .then(() => {
          executor(MUTATOR_NAMES.SET_REMOVING_ITEM, null);
          stateManagementService.dispatch(
              new LoadFolderContentAction(stateManagementService.state.folderInfo.id, this.#apiService));
        })
        .catch((error) => {
          executor(MUTATOR_NAMES.SET_ITEM_DELETING_ERROR, error.message);
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_IS_ITEM_DELETING, false);
        });
  }
}
