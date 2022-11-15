import {Action} from '../action';
import {ApiService} from '../../server-connection/api-service';
import {MUTATOR_NAMES} from '../mutators';

/**
 * Action to perform folder info loading.
 */
export class LoadFolderInfoAction extends Action {
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
    executor(MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, true);

    return this.#apiService
        .loadFolderInfo(this.#folderId)
        .then((folderInfo) => {
          executor(MUTATOR_NAMES.SET_FOLDER_INFO, folderInfo);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, error.message);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, false);
        });
  }
}
