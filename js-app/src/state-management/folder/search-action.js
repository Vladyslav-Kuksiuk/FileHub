import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';

/**
 * Action to perform folder content loading by search.
 */
export class SearchAction extends Action {
  #folderId;
  #searchValue;
  @inject apiService;

  /**
   * @param {string} folderId
   * @param {string} searchValue
   */
  constructor(folderId, searchValue) {
    super();
    this.#folderId = folderId;
    this.#searchValue = searchValue;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);

    return this.apiService
        .searchInFolder(this.#folderId, this.#searchValue)
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
