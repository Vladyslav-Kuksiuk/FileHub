import {Breadcrumb} from '../../components/breadcrumb';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {State} from '../../state-management/state';
import {inject} from '../../registry';
import {StateAwareWrapper} from '../state-aware-wrapper';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class BreadcrumbWrapper extends StateAwareWrapper {
  #eventTarget = new EventTarget();
  @inject stateManagementService;

  /**
   * Constructor.
   */
  constructor() {
    super();
    this.addStateListener('userProfile', (state)=>{
      this.#triggerFolderLoading(state);
    });

    this.addStateListener('locationMetadata', (state)=>{
      this.#triggerFolderLoading(state);
    });
  }

  /**
   * @param {State} state
   * @private
   */
  #triggerFolderLoading(state) {
    if (!state.userProfile) {
      return;
    }

    if (state.locationMetadata?.folderId != null && state.locationMetadata.folderId === state.folderInfo?.id) {
      return;
    }

    if (!!state.locationMetadata.folderId) {
      this.stateManagementService.dispatch(new LoadFolderInfoAction(state.locationMetadata.folderId));
      return;
    }

    this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
      detail: {
        folderId: state.userProfile.rootFolderId,
      },
    }));
  }

  /**
   * Adds state listeners to Breadcrumb component.
   *
   * @param {Breadcrumb} breadcrumb
   */
  wrap(breadcrumb) {
    this.addStateListener('isFolderInfoLoading', (state) => {
      breadcrumb.isLoading = state.isFolderInfoLoading;
    });

    this.addStateListener('isUserProfileLoading', (state) => {
      if (state.isUserProfileLoading) {
        breadcrumb.isLoading = true;
      }
    });

    this.addStateListener('folderInfo', (state) => {
      const toFolderListener = (folderId) =>{
        return ()=>{
          this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
            detail: {
              folderId: folderId,
            },
          }));
        };
      };

      if (!!state.folderInfo) {
        let path = [{name: 'Home'}];
        if (state.folderInfo.parentId === state?.userProfile?.rootFolderId) {
          path = [
            {name: 'Home',
              linkListener: toFolderListener(state.userProfile.rootFolderId)},
            {name: state.folderInfo.name}];
        } else if (state.folderInfo.parentId != null) {
          path = [
            {name: 'Home',
              linkListener: toFolderListener(state.userProfile.rootFolderId)},
            {name: '...',
              linkListener: toFolderListener(state.folderInfo.parentId)},
            {name: state.folderInfo.name}];
        }
        breadcrumb.path = path;
      } else {
        breadcrumb.path = [];
      }
    });

    this.addStateListener('folderInfoError', (state) => {
      breadcrumb.hasError = !!state.folderInfoError;
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

