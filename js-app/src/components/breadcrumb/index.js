import {Component} from '../../../../../../../Users/vladk/Desktop/Новая папка (2)/src/components/component.js';
import {StateManagementService} from '../../state-management/state-management-service';
import {FOLDER_INFO, STATE, USER_PROFILE} from '../../state-management/state';
import {Link} from '../../../../../../../Users/vladk/Desktop/Новая папка (2)/src/components/link/index.js';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';

const HOME_FOLDER_LINK_SLOT = 'home-folder-link-slot';
const PARENT_FOLDER_LINK_SLOT = 'parent-folder-link-slot';

/**
 * Breadcrumb component.
 */
export class Breadcrumb extends Component {
  #stateManagementService;
  #error;
  #rootFolderId;
  #folderName;
  #folderParentId;
  #isLoading;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   */
  constructor(parent, stateManagementService) {
    super(parent);

    const state = stateManagementService.state;
    this.#error = state[STATE.USER_PROFILE_ERROR];
    this.#rootFolderId = state[STATE.USER_PROFILE]?.[USER_PROFILE.ROOT_FOLDER_ID];
    this.#isLoading = state[STATE.IS_USER_PROFILE_LOADING] || state[STATE.IS_FOLDER_INFO_LOADING];
    this.#folderName = state[STATE.FOLDER_INFO]?.[FOLDER_INFO.NAME];
    this.#folderParentId = state[STATE.FOLDER_INFO]?.[FOLDER_INFO.PARENT_ID];

    this.#stateManagementService = stateManagementService;
    this.#stateManagementService.addStateListener(STATE.USER_PROFILE, (state) => {
      this.#setRootFolderId(state[STATE.USER_PROFILE]?.[USER_PROFILE.ROOT_FOLDER_ID]);
    });
    this.#stateManagementService.addStateListener(STATE.IS_FOLDER_INFO_LOADING, (state) => {
      this.#setIsLoading(state[STATE.IS_FOLDER_INFO_LOADING]);
    });
    this.#stateManagementService.addStateListener(STATE.FOLDER_INFO, (state) => {
      this.#setFolderInfo(state[STATE.FOLDER_INFO]);
    });
    this.#stateManagementService.addStateListener(STATE.FOLDER_INFO_ERROR, (state) => {
      this.#setError(state[STATE.FOLDER_INFO_ERROR]);
    });
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const homeFolderLinkSlot = this.getSlot(HOME_FOLDER_LINK_SLOT);
    const parentFolderLinkSlot = this.getSlot(PARENT_FOLDER_LINK_SLOT);

    if (homeFolderLinkSlot) {
      const homeFolderLink = new Link(homeFolderLinkSlot, 'Home');
      homeFolderLink.onClick(()=>{
        this.#stateManagementService.dispatch(new LoadFolderInfoAction(this.#rootFolderId));
      });
    }

    if (parentFolderLinkSlot) {
      const parentFolderLink = new Link(parentFolderLinkSlot, '...');
      parentFolderLink.onClick(()=>{
        this.#stateManagementService.dispatch(new LoadFolderInfoAction(this.#folderParentId));
      });
    }
  }

  /**
   * @param {string} id
   * @private
   */
  #setRootFolderId(id) {
    this.#rootFolderId = id;
    this.render();
  }

  /**
   * @param {string} folderInfo
   * @private
   */
  #setFolderInfo(folderInfo) {
    this.#folderName = folderInfo[FOLDER_INFO.NAME];
    this.#folderParentId = folderInfo[FOLDER_INFO.PARENT_ID];
    this.render();
  }

  /**
   * @param {string} error
   * @private
   */
  #setError(error) {
    this.#error = error;
    this.render();
  }

  /**
   * @param {boolean} isLoading
   * @private
   */
  #setIsLoading(isLoading) {
    this.#isLoading = isLoading;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    if (this.#isLoading) {
      return `<ul class="breadcrumb">
                <span ${this.markElement('breadcrumb-loading')}
                     aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
             </ul>`;
    }

    if (this.#error) {
      return `<ul class="breadcrumb">
                   <span ${this.markElement('breadcrumb-error')} class="text-danger"> 
                          <span class="glyphicon glyphicon-exclamation-sign"></span>
                          Can't load breadcrumb data
                   </span>
              </ul>`;
    }

    if (this.#folderParentId == null) {
      return `<ul class="breadcrumb">
                  <li>Home</li>
              </ul>`;
    }

    if (this.#rootFolderId === this.#folderParentId) {
      return `<ul class="breadcrumb">
                <li>${this.addSlot(HOME_FOLDER_LINK_SLOT)}</li>
                <li>${this.#folderName}</li>
             </ul>`;
    }

    return `<ul class="breadcrumb">
                <li>${this.addSlot(HOME_FOLDER_LINK_SLOT)}</li>
                <li>${this.addSlot(PARENT_FOLDER_LINK_SLOT)}</li>
                <li>${this.#folderName}</li>
            </ul>`;
  }
}
