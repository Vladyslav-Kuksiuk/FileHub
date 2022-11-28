import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';

/**
 * Action to execute loading information about username.
 */
export class UploadFilesAction extends Action {
    @inject apiService;
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
      executor(MUTATOR_NAMES.SET_FOLDER_TO_UPLOAD, this.#folderId);
      return this.apiService
          .uploadFiles(this.#folderId, this.#files)
          .then(() => {})
          .catch((error) => {
            executor(MUTATOR_NAMES.SET_FILES_UPLOADING_ERROR_INFO, {
              folderId: this.#folderId,
              error: error.message,
            });
          })
          .finally(() => {
            executor(MUTATOR_NAMES.SET_FOLDER_TO_UPLOAD, null);
          });
    }
}
