import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';
import {LoadFolderContentAction} from './load-folder-content-action';
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
          .then(() => {
            if (this.stateManagementService.state.folderInfo.id === this.#file.parentId) {
              this.stateManagementService.dispatch(new LoadFolderContentAction(this.#file.parentId));
            }
          })
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
