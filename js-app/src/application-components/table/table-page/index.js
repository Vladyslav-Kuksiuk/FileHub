import {Component} from '../../../components/component';
import {LogOutUserAction} from '../../../state-management/user/log-out-user-action';
import {StateManagementService} from '../../../state-management/state-management-service';
import {TitleService} from '../../../title-service';
import {BreadcrumbWrapper} from '../breadcrumb-wrapper';
import {UserInfoWrapper} from '../user-info-wrapper';
import {Breadcrumb} from '../../../components/breadcrumb';
import {UserInfo} from '../../../components/user-info';

const NAVIGATE_EVENT_AUTHORIZATION = 'NAVIGATE_EVENT_AUTHORIZATION';
const USER_INFO_SLOT = 'user-info-slot';
const BREADCRUMB_SLOT = 'breadcrumb-slot';
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
    const userInfoWrapper = new UserInfoWrapper(this.#stateManagementService);
    const userInfoSlot = this.getSlot(USER_INFO_SLOT);
    userInfoWrapper.wrap(
        new UserInfo(userInfoSlot, true, null, false));

    const breadcrumbWrapper = new BreadcrumbWrapper(this.#stateManagementService);
    const breadcrumbSlot = this.getSlot(BREADCRUMB_SLOT);
    breadcrumbWrapper.wrap(new Breadcrumb(
        breadcrumbSlot,
        true,
        false,
        [{name: 'Home'}],
    ));

    this.rootElement.querySelector('[data-td="logout-link"]').addEventListener('click', (event)=>{
      event.preventDefault();
      this.#stateManagementService.dispatch(new LogOutUserAction());
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_AUTHORIZATION));
    });
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
                ${this.addSlot(USER_INFO_SLOT)}
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
        ${this.addSlot(BREADCRUMB_SLOT)}
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
