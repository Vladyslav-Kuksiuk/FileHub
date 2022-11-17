import {ApplicationContext} from '../../application-context';
import {FolderContent} from '../../components/folder-content';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';

/**
 * FolderContent wrapper for state change listening.
 */
export class FolderContentWrapper {
  #eventTarget = new EventTarget();
  #stateManagementService;
  #stateListeners = [];

  /**
   * @param {ApplicationContext} applicationContext
   */
  constructor(applicationContext) {
    this.#stateManagementService = applicationContext.stateManagementService;

    const folderInfoListener = this.#stateManagementService.addStateListener('folderInfo', (state) => {
      if (state.folderInfo && !state.isFolderContentLoading) {
        this.#stateManagementService.dispatch(
            new LoadFolderContentAction(state.folderInfo.id, applicationContext.apiService));
      }
    });
    this.#stateListeners.push(folderInfoListener);
  }

  /**
   * Adds state listeners to FolderContent component.
   *
   * @param {FolderContent} folderContentComponent
   */
  wrap(folderContentComponent) {
    const folderContentListener = this.#stateManagementService.addStateListener('folderContent', (state) => {
      if (state.folderContent) {
        const folders = state.folderContent
            .filter((item) => item.type === 'folder')
            .map((folder) => {
              return {
                name: folder.name,
                linkListener: ()=>{
                  this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
                    detail: {
                      folderId: folder.id,
                    },
                  }));
                },
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
    this.#stateListeners.push(folderContentListener);

    const isFolderContentLoadingListener = this.#stateManagementService
        .addStateListener('isFolderContentLoading', (state) => {
          folderContentComponent.isLoading = state.isFolderContentLoading;
        });
    this.#stateListeners.push(isFolderContentLoadingListener);

    const isUserProfileLoadingListener = this.#stateManagementService
        .addStateListener('isUserProfileLoading', (state) => {
          if (state.isUserProfileLoading) {
            folderContentComponent.isLoading = true;
          }
        });
    this.#stateListeners.push(isUserProfileLoadingListener);

    const isFolderInfoLoadingListener = this.#stateManagementService
        .addStateListener('isFolderInfoLoading', (state) => {
          if (state.isFolderInfoLoading) {
            folderContentComponent.isLoading = true;
          }
        });
    this.#stateListeners.push(isFolderInfoLoadingListener);

    const folderContentErrorListener = this.#stateManagementService
        .addStateListener('folderContentError', (state) => {
          folderContentComponent.hasError = !!state.folderContentError;
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
