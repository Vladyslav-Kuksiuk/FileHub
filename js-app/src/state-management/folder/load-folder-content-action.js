import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';

/**
 * Action to perform folder content loading.
 */
export class LoadFolderContentAction extends Action {
  #folderId;
  @inject apiService;

  /**
   * @param {string} folderId
   */
  constructor(folderId) {
    super();
    this.#folderId = folderId;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);

    return this.apiService
        .loadFolderContent(this.#folderId)
        .then((folderContent) => {
          executor(MUTATOR_NAMES.SET_FOLDER_CONTENT, folderContent);
        })
        .catch((error) => {
          executor(MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR, error.message);
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, false);
        });
  }
}
