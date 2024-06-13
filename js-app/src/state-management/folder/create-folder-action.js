import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {FolderContentItem} from './folder-content-item';
import {LoadFolderContentAction} from './load-folder-content-action';
import {inject} from '../../registry';

/**
 * Action to perform folder creation.
 */
export class CreateFolderAction extends Action {
  #folder;
  @inject apiService;
  @inject stateManagementService;

  /**
   * @param {FolderContentItem} folder
   */
  constructor(folder) {
    super();
    this.#folder = folder;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE, this.#folder);

    return this.apiService
        .createFolder(this.#folder)
        .then(() => {
          executor(MUTATOR_NAMES.SET_IS_FOLDER_CREATION_MODAL_OPEN, false);
          this.stateManagementService.dispatch(
              new LoadFolderContentAction(this.stateManagementService.state.folderInfo.id));
        })
        .catch((error) => {
          executor(MUTATOR_NAMES.SET_FOLDER_CREATION_ERROR, error.message);
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE, null);
        });
  }
}
