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
    executor(MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);
    executor(MUTATOR_NAMES.SET_RENAMING_ITEM, this.#item);

    return this.apiService
        .renameItem(this.#item)
        .then(() => {
          executor(MUTATOR_NAMES.SET_RENAMING_ITEM, null);
          if (this.#item.parentId === this.stateManagementService.state.folderInfo.id) {
            this.stateManagementService.dispatch(new LoadFolderContentAction(this.#item.parentId));
          }
        })
        .catch((error) => {
          if (error instanceof FieldValidationError) {
            executor(MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS,
                error.fieldErrors.map((error)=> error.errorText));
          } else {
            executor(MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS, [error.message]);
          }
        });
  }
}
