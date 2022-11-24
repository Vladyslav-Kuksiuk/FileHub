import {Breadcrumb} from '../../components/breadcrumb';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {State} from '../../state-management/state';
import {inject} from "../../registry";

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class BreadcrumbWrapper {
  #eventTarget = new EventTarget();
  #stateListeners = [];
  @inject #stateManagementService;

  constructor() {
    const userProfileListener = this.#stateManagementService.addStateListener('userProfile', (state)=>{
      this.#triggerFolderLoading(state);
    });
    this.#stateListeners.push(userProfileListener);

    const locationMetadataListener = this.#stateManagementService.addStateListener('locationMetadata', (state)=>{
      this.#triggerFolderLoading(state);
    });
    this.#stateListeners.push(locationMetadataListener);
  }

  /**
   * @param {State} state
   * @private
   */
  #triggerFolderLoading(state) {
    if (state.userProfile) {
      console.log('folderId', state.locationMetadata?.folderId);
      if (state.locationMetadata?.folderId) {
        this.#stateManagementService.dispatch(
            new LoadFolderInfoAction(state.locationMetadata.folderId));
      } else {
        this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
          detail: {
            folderId: state.userProfile.rootFolderId,
          },
        }));
      }
    }
  }

  /**
   * Adds state listeners to Breadcrumb component.
   *
   * @param {Breadcrumb} breadcrumb
   */
  wrap(breadcrumb) {
    const isFolderInfoLoadingListener =
        this.#stateManagementService.addStateListener('isFolderInfoLoading', (state) => {
          breadcrumb.isLoading = state.isFolderInfoLoading;
        });
    this.#stateListeners.push(isFolderInfoLoadingListener);

    const isUserProfileLoadingListener =
        this.#stateManagementService.addStateListener('isUserProfileLoading', (state) => {
          if (state.isUserProfileLoading) {
            breadcrumb.isLoading = true;
          }
        });
    this.#stateListeners.push(isUserProfileLoadingListener);

    const folderInfoListener =
        this.#stateManagementService.addStateListener('folderInfo', (state) => {
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
    this.#stateListeners.push(folderInfoListener);

    const folderInfoErrorListener =
        this.#stateManagementService.addStateListener('folderInfoError', (state) => {
          breadcrumb.hasError = !!state.folderInfoError;
        });
    this.#stateListeners.push(folderInfoErrorListener);
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

