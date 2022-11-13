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
        let path = [{name: 'Home'}];
        if (state.folderInfo.parentId === state.userProfile.rootFolderId) {
          path = [
            {name: 'Home', linkListener: ()=>{}},
            {name: state.folderInfo.name}];
        } else if (state.folderInfo.parentId != null) {
          path = [
            {name: 'Home', linkListener: ()=>{}},
            {name: '...', linkListener: ()=>{}},
            {name: state.folderInfo.name}];
        }
        breadcrumb.path = path;
      } else {
        breadcrumb.path = {};
      }
    });

    this.#stateManagementService.addStateListener('folderInfoError', (state) => {
      breadcrumb.hasError = !!state.folderInfoError;
    });
  }
}

