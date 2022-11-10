import {Component} from '../../../components/component';
import {StateManagementService} from '../../../state-management/state-management-service';
import {Breadcrumb} from '../../../components/breadcrumb';
import {LoadFolderInfoAction} from '../../../state-management/folder/load-folder-info-action';

/**
 * Breadcrumb component with state listening.
 */
export class BreadcrumbWrapper extends Component {
  #stateManagementService;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   */
  constructor(parent, stateManagementService) {
    super(parent);

    this.#stateManagementService = stateManagementService;
    this.#stateManagementService.addStateListener('userProfile', (state)=>{
      if (state.userProfile) {
        this.#stateManagementService.dispatch(
            new LoadFolderInfoAction(state.userProfile.rootFolderId));
      }
    });
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const breadcrumb = new Breadcrumb(this.rootElement,
        true,
        false,
        false,
        false,
        null);

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

  /**
   * @inheritDoc
   */
  markup() {
    return '<slot></slot>';
  }
}
