import {FileList} from '../../components/file-list';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {inject} from '../../registry';
import {FolderRow} from '../../components/file-list/folder-row';
import {FileRow} from '../../components/file-list/file-row';
import {StateAwareWrapper} from '../state-aware-wrapper';
import {UploadFilesAction} from '../../state-management/folder/upload-files-action';
import {DefineRenamingItemAction} from '../../state-management/folder/define-renaming-item-action';
import {RenameItemAction} from '../../state-management/folder/rename-item-action';
import {FolderContentItem} from '../../state-management/folder/folder-content-item';
import {DownloadFileAction} from '../../state-management/folder/download-file-action.js';

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
                const temporaryName = (state.renamingItem?.id === folder.id) ? state.renamingItem.name : folder.name;

                const folderRow = new FolderRow(slot, folder.name, temporaryName);

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

                this.addStateListener('foldersToUpload', (state) => {
                  folderRow.isUploading = state.foldersToUpload.includes(folder.id);
                });

                this.addStateListener('filesUploadingErrorInfo', (state) => {
                  folderRow.uploadingError = state.filesUploadingErrorInfo[folder.id] ?? null;
                });

                folderRow.onRenameFormOpen(() => {
                  if (!this.stateManagementService.state.isItemRenaming) {
                    this.stateManagementService.dispatch(new DefineRenamingItemAction(folder));
                    folderRow.isRenameFormOpen = true;
                  }
                });

                folderRow.onRename((newName) => {
                  this.stateManagementService.dispatch(new RenameItemAction(new FolderContentItem({
                    type: folder.type,
                    parentId: folder.parentId,
                    id: folder.id,
                    name: newName,
                    itemsAmount: folder.itemsAmount,
                  })));
                });

                this.addStateListener('renamingItem', (state) => {
                  folderRow.isRenameFormOpen = state.renamingItem?.id === folder.id;
                });

                this.addStateListener('isItemRenaming', (state) => {
                  if (state.renamingItem?.id === folder.id) {
                    folderRow.isRenaming = state.isItemRenaming;
                  }
                });

                this.addStateListener('itemRenamingErrors', (state) => {
                  if (state.renamingItem?.id === folder.id) {
                    folderRow.renamingErrors = state.itemRenamingErrors;
                  } else {
                    folderRow.renamingErrors = [];
                  }
                });
              };
            });

        const fileCreators = state.folderContent
            .filter((item) => item.type === 'file')
            .map((file) => {
              return (slot) => {
                const temporaryName = (state.renamingItem?.id === file.id) ? state.renamingItem.name : file.name;

                const fileRow = new FileRow(slot, file.name, file.mimetype, file.size, temporaryName);

                fileRow.onRemove(()=>{
                  this.stateManagementService.dispatch(new DefineRemovingItemAction(file));
                });

                fileRow.onRenameFormOpen(() => {
                  if (!this.stateManagementService.state.isItemRenaming) {
                    this.stateManagementService.dispatch(new DefineRenamingItemAction(file));
                    fileRow.isRenameFormOpen = true;
                  }
                });

                fileRow.onRename((newName) => {
                  this.stateManagementService.dispatch(new RenameItemAction(new FolderContentItem({
                    type: file.type,
                    parentId: file.parentId,
                    id: file.id,
                    name: newName,
                    size: file.size,
                    mimetype: file.mimetype,
                  })));
                });

                this.addStateListener('renamingItem', (state) => {
                  fileRow.isRenameFormOpen = state.renamingItem?.id === file.id;
                });

                this.addStateListener('isItemRenaming', (state) => {
                  if (state.renamingItem?.id === file.id) {
                    fileRow.isRenaming = state.isItemRenaming;
                  }
                });

                this.addStateListener('itemRenamingErrors', (state) => {
                  if (state.renamingItem?.id === file.id) {
                    fileRow.renamingErrors = state.itemRenamingErrors;
                  } else {
                    fileRow.renamingErrors = [];
                  }
                });

                fileRow.onDownload(() => {
                  this.stateManagementService.dispatch(new DownloadFileAction(file));
                });

                this.addStateListener('downloadingFiles', (state) => {
                  fileRow.isDownloading = state.downloadingFiles.includes(file.id);
                });

                this.addStateListener('filesDownloadingError', (state) => {
                  fileRow.downloadingError = state.filesDownloadingError[file.id] ?? null;
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
