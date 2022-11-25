import {FileList} from '../../components/file-list';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {inject} from '../../registry';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * FileList wrapper for state change listening.
 */
export class FileListWrapper {
  #eventTarget = new EventTarget();
  @inject #stateManagementService;
  #stateListeners = [];

  constructor() {
    const folderInfoListener = this.#stateManagementService.addStateListener('folderInfo', (state) => {
      if (state.folderInfo && !state.isFolderContentLoading) {
        this.#stateManagementService.dispatch(
            new LoadFolderContentAction(state.folderInfo.id));
      }
    });
    this.#stateListeners.push(folderInfoListener);
  }

  /**
   * Adds state listeners to FileList component.
   *
   * @param {FileList} fileList
   */
  wrap(fileList) {
    const folderContentListener = this.#stateManagementService
        .addStateListener('folderContent', (state) => {
          if (state.folderContent) {
            const folders = state.folderContent
                .filter((item) => item.type === 'folder')
                .map((folder) => {
                  return {
                    name: folder.name,
                    linkListener: ()=>{
                      this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                        detail: {
                          folderId: folder.id,
                        },
                      }));
                    },
                    deleteListener: () => {
                      this.#stateManagementService.dispatch(new DefineRemovingItemAction(folder));
                    },
                  };
                });

            const files = state.folderContent
                .filter((item) => item.type !== 'folder')
                .map((file) => {
                  return {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    deleteListener: () => {
                      this.#stateManagementService.dispatch(new DefineRemovingItemAction(file));
                    },
                  };
                });
            fileList.setContent(folders, files);
          } else {
            fileList.setContent([], []);
          }
        });
    this.#stateListeners.push(folderContentListener);

    const isFolderContentLoadingListener = this.#stateManagementService
        .addStateListener('isFolderContentLoading', (state) => {
          fileList.isLoading = state.isFolderContentLoading;
        });
    this.#stateListeners.push(isFolderContentLoadingListener);

    const isUserProfileLoadingListener = this.#stateManagementService
        .addStateListener('isUserProfileLoading', (state) => {
          if (state.isUserProfileLoading) {
            fileList.isLoading = true;
          }
        });
    this.#stateListeners.push(isUserProfileLoadingListener);

    const isFolderInfoLoadingListener = this.#stateManagementService
        .addStateListener('isFolderInfoLoading', (state) => {
          if (state.isFolderInfoLoading) {
            fileList.isLoading = true;
          }
        });
    this.#stateListeners.push(isFolderInfoLoadingListener);

    const folderContentErrorListener = this.#stateManagementService
        .addStateListener('folderContentError', (state) => {
          fileList.hasError = !!state.folderContentError;
        });
    this.#stateListeners.push(folderContentErrorListener);
  }

  /**
   * Adds listener on navigate to folder event.
   *
   * @param {function(string)} listener
   */
  onNavigateToFolder(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_FOLDER, (event)=>{
      listener(event.detail.folderId);
    });
  }

  /**
   * Deletes all created state listeners.
   */
  removeStateListeners() {
    this.#stateListeners.forEach((stateListener) => {
      this.#stateManagementService.removeStateListener(stateListener.field, stateListener.listener);
    });
  }
}
