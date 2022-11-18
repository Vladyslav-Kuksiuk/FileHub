import {LoadUserAction} from '../../state-management/user/load-user-action';
import {ApplicationContext} from '../../application-context';
import {FileList} from '../../components/file-list';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';

/**
 * FileList wrapper for state change listening.
 */
export class FileListWrapper {
  #stateManagementService;

  /**
   * @param {ApplicationContext} applicationContext
   */
  constructor(applicationContext) {
    this.#stateManagementService = applicationContext.stateManagementService;

    const state = this.#stateManagementService.state;

    if (state.userProfile == null && !state.isUserProfileLoading) {
      this.#stateManagementService.dispatch(new LoadUserAction(applicationContext.apiService));
    }

    this.#stateManagementService.addStateListener('userProfile', (state) => {
      if (state.userProfile) {
        this.#stateManagementService.dispatch(
            new LoadFolderInfoAction(state.userProfile.rootFolderId, applicationContext.apiService));
      }
    });

    this.#stateManagementService.addStateListener('folderInfo', (state) => {
      if (state.folderInfo) {
        this.#stateManagementService.dispatch(
            new LoadFolderContentAction(state.folderInfo.id, applicationContext.apiService));
      }
    });
  }

  /**
   * Adds state listeners to FileList component.
   *
   * @param {FileList} fileList
   */
  wrap(fileList) {
    this.#stateManagementService.addStateListener('folderContent', (state) => {
      if (state.folderContent) {
        const folders = state.folderContent
            .filter((item) => item.type === 'folder')
            .map((folder) => {
              return {
                name: folder.name,
              };
            });

        const files = state.folderContent
            .filter((item) => item.type !== 'folder')
            .map((file) => {
              return {
                name: file.name,
                type: file.type,
                size: file.size,
              };
            });
        fileList.setContent(folders, files);
      } else {
        fileList.setContent([], []);
      }
    });

    this.#stateManagementService.addStateListener('isFolderContentLoading', (state) => {
      fileList.isLoading = state.isFolderContentLoading;
    });

    this.#stateManagementService.addStateListener('isUserProfileLoading', (state) => {
      if (state.isUserProfileLoading) {
        fileList.isLoading = true;
      }
    });

    this.#stateManagementService.addStateListener('isFolderInfoLoading', (state) => {
      if (state.isFolderInfoLoading) {
        fileList.isLoading = true;
      }
    });

    this.#stateManagementService.addStateListener('folderContentError', (state) => {
      fileList.hasError = !!state.folderContentError;
    });
  }
}
