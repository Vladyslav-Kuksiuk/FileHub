import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';
import {LoadFolderContentAction} from './load-folder-content-action';
import {inject} from '../../registry';

/**
 * Action to perform item renaming.
 */
export class RenameItemAction extends Action {
  #item;
  @inject apiService;

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
    executor(MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);

    return this.apiService
        .renameItem(this.#item)
        .then(() => {
          executor(MUTATOR_NAMES.SET_RENAMING_ITEM, null);
          stateManagementService.dispatch(
              new LoadFolderContentAction(stateManagementService.state.folderInfo.id));
        })
        .catch((error) => {
          if (error instanceof FieldValidationError) {
            executor(MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS,
                Object.values(error.fieldErrors));
          } else {
            executor(MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS, [error.message]);
          }
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_IS_ITEM_RENAMING, false);
        });
  }
}
