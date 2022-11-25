import {FileList} from '../../components/file-list';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {inject} from '../../registry';
import {FolderRow} from '../../components/file-list/folder-row.js';
import {FileRow} from '../../components/file-list/file-row.js';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * FileList wrapper for state change listening.
 */
export class FileListWrapper {
  #eventTarget = new EventTarget();
  @inject #stateManagementService;
  #stateListeners = [];

  /**
   * Constructor.
   */
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
            const folderCreators = state.folderContent
                .filter((item) => item.type === 'folder')
                .map((folder) => {
                  return (slot) => {
                    const folderRow = new FolderRow(slot, folder.name);
                    folderRow.onRemove(()=>{
                      this.#stateManagementService.dispatch(new DefineRemovingItemAction(folder));
                    });
                    folderRow.onFolderLinkClick(()=>{
                      this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                        detail: {
                          folderId: folder.id,
                        },
                      }));
                    });
                  };
                });

            const fileCreators = state.folderContent
                .filter((item) => item.type !== 'folder')
                .map((file) => {
                  return (slot) => {
                    const fileRow = new FileRow(slot, file.name, file.type, file.size);
                    fileRow.onRemove(()=>{
                      this.#stateManagementService.dispatch(new DefineRemovingItemAction(file));
                    });
                  };
                });
            fileList.setContent(folderCreators, fileCreators);
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
