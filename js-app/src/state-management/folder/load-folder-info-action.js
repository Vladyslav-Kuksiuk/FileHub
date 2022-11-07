import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {STATE} from '../state';

/**
 * Action to perform folder info loading.
 */
export class LoadFolderInfoAction extends Action {
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
    executor(MUTATOR_NAMES.SET_FOLDER_INFO, null);
    executor(MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, null);
    executor(MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, true);

    return applicationContext.apiService
        .loadFolderInfo(this.#folderId)
        .then((body) => {
          executor(MUTATOR_NAMES.SET_FOLDER_INFO, body[STATE.FOLDER_INFO]);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, error.message);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, false);
        });
  }
}
