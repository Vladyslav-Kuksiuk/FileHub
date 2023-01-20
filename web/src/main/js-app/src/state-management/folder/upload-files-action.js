import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';
import {LoadFolderContentAction} from './load-folder-content-action';

/**
 * Action to upload files.
 */
export class UploadFilesAction extends Action {
    @inject apiService;
    @inject stateManagementService;
    #folderId;
    #files;

    /**
     * @param {string} folderId
     * @param {object} files
     */
    constructor(folderId, files) {
      super();
      this.#folderId = folderId;
      this.#files = files;
    }
    /**
     * @inheritDoc
     * @param {Function} executor
     */
    execute(executor) {
      executor(MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD, this.#folderId);
      return this.apiService
          .uploadFiles(this.#folderId, this.#files)
          .then(() => {
            if (this.stateManagementService.state.folderInfo.id === this.#folderId) {
              this.stateManagementService.dispatch(new LoadFolderContentAction(this.#folderId));
            }
          })
          .catch((error) => {
            executor(MUTATOR_NAMES.ADD_FILES_UPLOADING_ERROR_INFO, {
              folderId: this.#folderId,
              error: error.message,
            });
          })
          .finally(() => {
            executor(MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD, this.#folderId);
          });
    }
}
