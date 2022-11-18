import {Action} from '../action';
import {ApiService} from '../../server-connection/api-service';
import {MUTATOR_NAMES} from '../mutators';

/**
 * Action to perform folder content loading.
 */
export class LoadFolderContentAction extends Action {
  #folderId;
  #apiService;

  /**
   * @param {string} folderId
   * @param {ApiService} apiService
   */
  constructor(folderId, apiService) {
    super();
    this.#folderId = folderId;
    this.#apiService = apiService;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);

    return this.#apiService
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
