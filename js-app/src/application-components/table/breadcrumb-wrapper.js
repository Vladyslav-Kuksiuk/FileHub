import {Breadcrumb} from '../../components/breadcrumb';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {LoadUserAction} from '../../state-management/user/load-user-action';
import {StateManagementService} from '../../state-management/state-management-service';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class BreadcrumbWrapper {
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

    stateManagementService.addStateListener('userProfile', (state)=>{
      if (state.userProfile) {
        stateManagementService.dispatch(
            new LoadFolderInfoAction(state.userProfile.rootFolderId));
      }
    });
  }

  /**
   * Adds state listeners to Breadcrumb component.
   *
   * @param {Breadcrumb} breadcrumb
   */
  wrap(breadcrumb) {
    this.#stateManagementService.addStateListener('isFolderInfoLoading', (state) => {
      breadcrumb.isLoading = state.isFolderInfoLoading;
    });

    this.#stateManagementService.addStateListener('folderInfo', (state) => {
      if (!!state.folderInfo) {
        breadcrumb.folderName = state.folderInfo.name;
        if (state.folderInfo.parentId == null) {
          breadcrumb.isFirstNesting = false;
          breadcrumb.isSecondNesting = false;
        } else if (state.folderInfo.parentId === state.userProfile.rootFolderId) {
          breadcrumb.isFirstNesting = true;
          breadcrumb.isSecondNesting = false;
        } else {
          breadcrumb.isFirstNesting = false;
          breadcrumb.isSecondNesting = true;
        }
      } else {
        breadcrumb.folderName = null;
        breadcrumb.isFirstNesting = false;
        breadcrumb.isSecondNesting = false;
      }
    });

    this.#stateManagementService.addStateListener('folderInfoError', (state) => {
      breadcrumb.hasError = !!state.folderInfoError;
    });
  }
}

