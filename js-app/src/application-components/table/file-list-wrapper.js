import {FileList} from '../../components/file-list';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {inject} from '../../registry';
import {FolderRow} from '../../components/file-list/folder-row.js';
import {FileRow} from '../../components/file-list/file-row.js';
import {StateAwareWrapper} from '../state-aware-wrapper';
import {UploadFilesAction} from '../../state-management/folder/upload-files-action';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * FileList wrapper for state change listening.
 */
export class FileListWrapper extends StateAwareWrapper {
  #eventTarget = new EventTarget();
  @inject stateManagementService;

  /**
   * Constructor.
   */
  constructor() {
    super();
    this.addStateListener('folderInfo', (state) => {
      if (state.folderInfo && !state.isFolderContentLoading) {
        this.stateManagementService.dispatch(
            new LoadFolderContentAction(state.folderInfo.id));
      }
    });
  }

  /**
   * Adds state listeners to FileList component.
   *
   * @param {FileList} fileList
   */
  wrap(fileList) {
    this.addStateListener('folderContent', (state) => {
      if (state.folderContent) {
        const folderCreators = state.folderContent
            .filter((item) => item.type === 'folder')
            .map((folder) => {
              return (slot) => {
                const folderRow = new FolderRow(slot, folder.name);

                folderRow.onRemove(()=>{
                  this.stateManagementService.dispatch(new DefineRemovingItemAction(folder));
                });

                folderRow.onFolderLinkClick(()=>{
                  this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                    detail: {
                      folderId: folder.id,
                    },
                  }));
                });

                folderRow.onUpload(() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.setAttribute('multiple', '');
                  input.click();
                  input.addEventListener('change', ()=>{
                    this.stateManagementService.dispatch(
                        new UploadFilesAction(
                            folder.id,
                            input.files));
                  });
                });
              };
            });

        const fileCreators = state.folderContent
            .filter((item) => item.type !== 'folder')
            .map((file) => {
              return (slot) => {
                const fileRow = new FileRow(slot, file.name, file.type, file.size);
                fileRow.onRemove(()=>{
                  this.stateManagementService.dispatch(new DefineRemovingItemAction(file));
                });
              };
            });
        fileList.setContent(folderCreators, fileCreators);
      } else {
        fileList.setContent([], []);
      }
    });

    this.addStateListener('isFolderContentLoading', (state) => {
      fileList.isLoading = state.isFolderContentLoading;
    });

    this.addStateListener('isUserProfileLoading', (state) => {
      if (state.isUserProfileLoading) {
        fileList.isLoading = true;
      }
    });

    this.addStateListener('isFolderInfoLoading', (state) => {
      if (state.isFolderInfoLoading) {
        fileList.isLoading = true;
      }
    });

    this.addStateListener('folderContentError', (state) => {
      fileList.hasError = !!state.folderContentError;
    });
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
}
