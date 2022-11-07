import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {STATE} from '../state';

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
    executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);

    return applicationContext.apiService
        .loadFolderContent(this.#folderId)
        .then((body) => {
          executor(MUTATOR_NAMES.SET_FOLDER_INFO, body[STATE.FOLDER_CONTENT]);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR, error.message);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, false);
        });
  }
}
