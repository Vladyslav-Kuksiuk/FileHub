import {Component} from '../component';
import {LogOutUserAction} from '../../state-management/user/log-out-user-action';
import {UserInfo} from '../user-info';
import {StateManagementService} from '../../state-management/state-management-service';
import {TitleService} from '../../title-service';
import {LoadUserAction} from '../../state-management/user/load-user-action.js';
import {Breadcrumb} from '../breadcrumb/index';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {STATE, USER_PROFILE, FOLDER_INFO} from '../../state-management/state';
import {FolderContent} from '../folder-content';
import {LoadFolderContentAction} from '../../state-management/folder/load-folder-content-action';

const NAVIGATE_EVENT_AUTHORIZATION = 'NAVIGATE_EVENT_AUTHORIZATION';

const FOLDER_CONTENT_SLOT = 'folder-content-slot';

/**
 * Table page component.
 */
export class TablePage extends Component {
  #eventTarget = new EventTarget();
  #stateManagementService;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   * @param {TitleService} titleService
   */
  constructor(parent, stateManagementService, titleService) {
    super(parent);
    titleService.setTitles(['Table']);
    this.#stateManagementService = stateManagementService;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.#stateManagementService.addStateListener(STATE.USER_PROFILE, (state)=>{
      if (state[STATE.USER_PROFILE]) {
        this.#stateManagementService.dispatch(
            new LoadFolderInfoAction(state[STATE.USER_PROFILE][USER_PROFILE.ROOT_FOLDER_ID]));
      }
    });

    this.#stateManagementService.addStateListener(STATE.FOLDER_INFO, (state)=>{
      if (state[STATE.FOLDER_INFO]) {
        this.#stateManagementService.dispatch(
            new LoadFolderContentAction(state[STATE.FOLDER_INFO][FOLDER_INFO.ID]));
      }
    });

    const userInfoSlot = this.getSlot('user-info');
    new UserInfo(userInfoSlot, this.#stateManagementService);
    this.#stateManagementService.dispatch(new LoadUserAction());

    const breadcrumbSlot = this.getSlot('breadcrumb-slot');
    new Breadcrumb(breadcrumbSlot, this.#stateManagementService);

    this.rootElement.querySelector('[data-td="logout-link"]').addEventListener('click', (event)=>{
      event.preventDefault();
      this.#stateManagementService.dispatch(new LogOutUserAction());
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_AUTHORIZATION));
    });

    const folderContentSlot = this.getSlot(FOLDER_CONTENT_SLOT);
    new FolderContent(folderContentSlot, this.#stateManagementService);
  }

  /**
   * Adds listener on navigate to authorization event.
   *
   * @param {Function} listener
   */
  onNavigateToAuthorization(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_AUTHORIZATION, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <div class="page-wrapper table-page-wrapper">
    <header class="page-header">
        <a href="/web-client/static"><img alt="TeamDev" height="37" src="static/images/logo.png"
                                          title="TeamDev" width="200"></a>
            <ul class="authorized-user-panel">
            <li>
                ${this.addSlot('user-info')}
            </li>
            <li>
                <a ${this.markElement('logout-link')} class="logout-button" href="/" title="Log Out">
                    Log Out
                    <span aria-hidden="true" class="glyphicon glyphicon-log-out"></span>
                </a>
            </li>
        </ul>
    </header>
    <main class="container">
        ${this.addSlot('breadcrumb-slot')}
        <hr class="horizontal-line">
        <div class="row table-tool-bar">
            <div class="col-xs-8 col-sm-6">
                <div class="input-group search-line">
                    <input class="form-control" id="search" name="Search" placeholder="Enter entity name..."
                           type="text">
                    <span class="input-group-btn">
                            <button class="btn btn-primary" title="Search" type="button">
                                Search
                            </button>
                    </span>
                </div>
            </div>
            <div class="col-xs-4 col-sm-6 tool-bar-buttons">
                <div aria-label="..." class="btn-group" role="group">
                    <button class="btn btn-primary" title="Upload file" type="button">
                        <span aria-hidden="true" class="glyphicon glyphicon-upload"></span>
                    </button>
                    <button class="btn btn-primary" data-target="#modal-create-folder" data-toggle="modal"
                            title="Add folder" type="button">
                        <span aria-hidden="true" class="glyphicon glyphicon-plus"></span>
                    </button>
                </div>
            </div>
        </div>
        ${this.addSlot(FOLDER_CONTENT_SLOT)}
    </main>
    <footer class="page-footer">
        <ul class="list-inline social-icons">
            <li>
                <a href="https://www.linkedin.com/company/teamdev-ltd-/"
                   target="_blank" title="Linked In">
                    <img alt="Linked In" src="static/images/icon-linkedin.png">
                </a>
            </li>
            <li>
                <a href="https://www.facebook.com/TeamDev" target="_blank" title="Facebook">
                    <img alt="Facebook" src="static/images/icon-facebook.png">
                </a>
            </li>
            <li>
                <a href="https://www.instagram.com/teamdev_ltd/" target="_blank" title="Instagram">
                    <img alt="Instagram" src="static/images/icon-instagram.png">
                </a>
            </li>
        </ul>
        <p class="copyright">
            Copyright © 2020 <a href="/">TeamDev</a>. All rights reserved.
        </p>
    </footer>
</div>
    `;
  }
}
