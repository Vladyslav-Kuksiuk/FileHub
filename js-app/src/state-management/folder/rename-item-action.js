import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';
import {LoadFolderContentAction} from './load-folder-content-action';
import {inject} from '../../registry';
import {FieldValidationError} from '../../server-connection/field-validation-error';

/**
 * Action to perform item renaming.
 */
export class RenameItemAction extends Action {
  #item;
  #newName;
  @inject apiService;

  /**
   * @param {FolderContentItem} item
   * @param {string} newName
   */
  constructor(item, newName) {
    super();
    this.#item = item;
    this.#newName = newName;
  }

  /**
   * @inheritDoc
   */
  execute(executor, stateManagementService) {
    executor(MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);

    return this.apiService
        .renameItem(this.#item, this.#newName)
        .then(() => {
          executor(MUTATOR_NAMES.SET_RENAMING_ITEM, null);
          stateManagementService.dispatch(
              new LoadFolderContentAction(stateManagementService.state.folderInfo.id));
        })
        .catch((error) => {
          if (error instanceof FieldValidationError) {
            executor(MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS,
                error.fieldErrors.map((error)=> error.errorText));
          } else {
            executor(MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS, [error.message]);
          }
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_IS_ITEM_RENAMING, false);
        });
  }
}
