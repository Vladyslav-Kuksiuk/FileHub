import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';
import {FolderContentItem} from './folder-content-item';

/**
 * Action to download file.
 */
export class DownloadFileAction extends Action {
    @inject downloadService;
    @inject stateManagementService;
    #file;

    /**
     * @param {FolderContentItem} file
     */
    constructor( file) {
      super();
      this.#file = file;
    }
    /**
     * @inheritDoc
     * @param {Function} executor
     */
    execute(executor) {
      executor(MUTATOR_NAMES.ADD_DOWNLOADING_FILE, this.#file.id);
      return this.downloadService
          .download(this.#file)
          .catch((error) => {
            executor(MUTATOR_NAMES.ADD_FILE_DOWNLOADING_ERROR, {
              fileId: this.#file.id,
              error: error.message,
            });
          })
          .finally(() => {
            executor(MUTATOR_NAMES.REMOVE_DOWNLOADING_FILE, this.#file.id);
          });
    }
}
