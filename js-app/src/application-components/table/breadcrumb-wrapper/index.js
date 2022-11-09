import {Component} from '../../../components/component';
import {StateManagementService} from '../../../state-management/state-management-service';
import {STATE} from '../../../state-management/state';
import {Breadcrumb} from '../../../components/breadcrumb';
import {LoadFolderInfoAction} from '../../../state-management/folder/load-folder-info-action.js';

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
    this.#stateManagementService.addStateListener(STATE.USER_PROFILE, (state)=>{
      if (state[STATE.USER_PROFILE]) {
        this.#stateManagementService.dispatch(
            new LoadFolderInfoAction(state[STATE.USER_PROFILE].rootFolderId));
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

    this.#stateManagementService.addStateListener(STATE.IS_FOLDER_INFO_LOADING, (state) => {
      breadcrumb.isLoading = state[STATE.IS_FOLDER_INFO_LOADING];
    });
    this.#stateManagementService.addStateListener(STATE.FOLDER_INFO, (state) => {
      if (!!state[STATE.FOLDER_INFO]) {
        breadcrumb.folderName = state[STATE.FOLDER_INFO].name;
        if (state[STATE.FOLDER_INFO].parentId == null) {
          breadcrumb.isFirstNesting = false;
          breadcrumb.isSecondNesting = false;
        } else if (state[STATE.FOLDER_INFO].parentId === state[STATE.USER_PROFILE].rootFolderId) {
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
    this.#stateManagementService.addStateListener(STATE.FOLDER_INFO_ERROR, (state) => {
      breadcrumb.hasError = !!state[STATE.FOLDER_INFO_ERROR];
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return '<slot></slot>';
  }
}
