import {Breadcrumb} from '../../components/breadcrumb';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {LoadUserAction} from '../../state-management/user/load-user-action';
import {ApplicationContext} from '../../application-context';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class BreadcrumbWrapper {
  #eventTarget = new EventTarget();
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

    this.#stateManagementService.addStateListener('userProfile', (state)=>{
      if (state.userProfile) {
        if (state.locationFolderId) {
          this.#stateManagementService.dispatch(
              new LoadFolderInfoAction(state.locationFolderId, applicationContext.apiService));
        } else {
          this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
            detail: {
              folderId: state.userProfile.rootFolderId,
            },
          }));
      }
    }
  })}

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
        if (state.folderInfo.parentId === state?.userProfile?.rootFolderId) {
          path = [
            {name: 'Home',
              linkListener: ()=>{
                this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                  detail: {
                    folderId: state.userProfile.rootFolderId,
                  },
                }));
              }},
            {name: state.folderInfo.name}];
        } else if (state.folderInfo.parentId != null) {
          path = [
            {name: 'Home',
              linkListener: ()=>{
                this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                  detail: {
                    folderId: state.userProfile.rootFolderId,
                  },
                }));
              }},
            {name: '...',
              linkListener: ()=>{
                this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                  detail: {
                    folderId: state.folderInfo.parentId,
                  },
                }));
              }},
            {name: state.folderInfo.name}];
        }
        breadcrumb.path = path;
      } else {
        breadcrumb.path = [];
      }
    });

    this.#stateManagementService.addStateListener('folderInfoError', (state) => {
      breadcrumb.hasError = !!state.folderInfoError;
    });
  }

  onNavigateToFolder(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_FOLDER, (event)=>{
      listener(event.detail.folderId);
    });
  }
}

