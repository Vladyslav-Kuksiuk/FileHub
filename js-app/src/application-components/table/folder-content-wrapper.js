import {LoadUserAction} from '../../state-management/user/load-user-action';
import {StateManagementService} from '../../state-management/state-management-service';
import {FolderContent} from '../../components/folder-content';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class FolderContentWrapper {
  #stateManagementService;

  /**
   * @param {StateManagementService} stateManagementService
   */
  constructor(stateManagementService) {
    this.#stateManagementService = stateManagementService;

    const state = stateManagementService.state;

    if (state.userProfile == null && !state.isUserProfileLoading) {
      stateManagementService.dispatch(new LoadUserAction());
    }

    if (state.folderInfo == null && !state.isFolderInfoLoading) {
      stateManagementService.addStateListener('userProfile', (state) => {
        if (state.userProfile) {
          stateManagementService.dispatch(
              new LoadFolderInfoAction(state.userProfile.rootFolderId));
        }
      });
    }

    stateManagementService.addStateListener('folderInfo', (state) => {
      if (state.folderInfo) {
        stateManagementService.dispatch(
            new LoadFolderContentAction(state.folderInfo.id));
      }
    });
  }

  /**
   * Adds state listeners to FolderContent component.
   *
   * @param {FolderContent} folderContentComponent
   */
  wrap(folderContentComponent) {
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
        folderContentComponent.setContent(folders, files);
      } else {
        folderContentComponent.setContent([], []);
      }
    });

    this.#stateManagementService.addStateListener('isFolderContentLoading', (state) => {
      folderContentComponent.isLoading = state.isFolderContentLoading;
    });

    this.#stateManagementService.addStateListener('folderContentError', (state) => {
      folderContentComponent.hasError = !!state.folderContentError;
    });
  }
}
