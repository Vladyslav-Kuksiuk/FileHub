import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators.js';
import {STATE} from '../state.js';

/**
 * Action to perform user loading.
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
