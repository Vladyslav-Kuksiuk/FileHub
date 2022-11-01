import {Component} from '../component';
import {LogOutUserAction} from '../../state-management/user/log-out-user-action';
import {ApplicationContext} from '../../application-context';
import {UserPanel} from '../user-panel';

const NAVIGATE_EVENT_AUTHORIZATION = 'NAVIGATE_EVENT_AUTHORIZATION';

/**
 * Table page component.
 */
export class TablePage extends Component {
  #eventTarget = new EventTarget();
  #stateManagementService;

  /**
   * @param {HTMLElement} parent
   * @param {ApplicationContext} applicationContext
   */
  constructor(parent, applicationContext) {
    super(parent);
    applicationContext.titleService.setTitles(['Table']);
    this.#stateManagementService = applicationContext.stateManagementService;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const userPanelSlot = this.getSlot('user-panel');
    const userPanel = new UserPanel(userPanelSlot, this.#stateManagementService);
    userPanel.onLinkClick(()=>{
      this.#stateManagementService.dispatch(new LogOutUserAction({}));
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
        ${this.addSlot('user-panel')}
    </header>
    <main class="container">
        <ul class="breadcrumb">
            <li class="active">Home</li>
        </ul>
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
        <div class="table-wrapper">
            <table class="table table-hover">
                <tr>
                    <td class="cell-arrow">
                        <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
                    </td>
                    <td class="cell-icon">
                        <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
                    </td>
                    <td class="cell-name"><a href="inner.html">Documents</a></td>
                    <td class="cell-type">Folder</td>
                    <td class="cell-size">—</td>
                    <td class="cell-buttons">
                        <div class="data-buttons-container">
                            <button class="icon-button"
                                    title="Upload file.">
                                <span aria-hidden="true" class="glyphicon glyphicon-upload"></span>
                            </button>
                            <button class="icon-button" title="Delete">
                                <span aria-hidden="true"
                                      class="glyphicon glyphicon-remove-circle"></span>
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
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
