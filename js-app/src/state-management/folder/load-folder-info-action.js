import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';

/**
 * Action to perform folder info loading.
 */
export class LoadFolderInfoAction extends Action {
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
    executor(MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, true);

    return this.apiService
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
