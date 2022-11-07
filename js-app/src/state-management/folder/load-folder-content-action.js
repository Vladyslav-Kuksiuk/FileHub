import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';

/**
 * Action to perform folder content loading.
 */
export class LoadFolderContentAction extends Action {
  #folderId;

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
  execute(executor, applicationContext) {
    executor(MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR, null);
    executor(MUTATOR_NAMES.SET_FOLDER_CONTENT, null);
    executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);

    return applicationContext.apiService
        .loadFolderContent(this.#folderId)
        .then((body) => {
          executor(MUTATOR_NAMES.SET_FOLDER_CONTENT, body);
        })
        .catch((error) => {
          executor(MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR, error.message);
        })
        .finally(() => {
          executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, false);
        });
  }
}
