import {Component} from '../../../components/component';
import {LogOutUserAction} from '../../../state-management/user/log-out-user-action';
import {BreadcrumbWrapper} from '../breadcrumb-wrapper';
import {UserInfoWrapper} from '../user-info-wrapper';
import {Breadcrumb} from '../../../components/breadcrumb';
import {UserInfo} from '../../../components/user-info';
import {FileListWrapper} from '../file-list-wrapper';
import {FileList} from '../../../components/file-list';
import {ModalRemove} from '../../../components/modal-remove';
import {ModalRemoveWrapper} from '../modal-remove-wrapper';
import {inject} from '../../../registry';
import {ButtonGroupWrapper} from '../button-group-wrapper';
import {ButtonGroup} from '../../../components/button-group';
import {ModalCreate} from '../../../components/modal-create';
import {ModalCreateWrapper} from '../modal-create-wrapper';
import {SearchRowWrapper} from '../search-row-wrapper';
import {SearchRow} from '../../../components/search-row';

const NAVIGATE_EVENT_FOLDER = 'NAVIGATE_EVENT_FOLDER';
const SEARCH_EVENT = 'SEARCH_EVENT';
const USER_INFO_SLOT = 'user-info-slot';
const BREADCRUMB_SLOT = 'breadcrumb-slot';
const SEARCH_ROW_SLOT = 'search-row-slot';
const FILE_LIST_SLOT = 'file-list-slot';
const MODAL_REMOVE_SLOT = 'modal-remove-slot';
const BUTTON_GROUP_SLOT = 'button-group-slot';
const MODAL_CREATE_SLOT = 'modal-create-slot';

/**
 * Table page component.
 */
export class TablePage extends Component {
  #eventTarget = new EventTarget();
  @inject stateManagementService;
  @inject titleService;
  #modalRemoveWrapper;
  #modalCreateWrapper;
  #userInfoWrapper;
  #breadcrumbWrapper;
  #fileListWrapper;
  #buttonGroupWrapper;
  #searchRowWrapper;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.titleService.setTitles(['Table']);
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const modalRemoveSlot = this.getSlot(MODAL_REMOVE_SLOT);
    this.#modalRemoveWrapper = new ModalRemoveWrapper();
    this.#modalRemoveWrapper.wrap(new ModalRemove(modalRemoveSlot, '', '', null));

    const modalCreateSlot = this.getSlot(MODAL_CREATE_SLOT);
    this.#modalCreateWrapper = new ModalCreateWrapper();
    this.#modalCreateWrapper.wrap(new ModalCreate(modalCreateSlot, null));

    const userInfoWrapper = new UserInfoWrapper();
    this.#userInfoWrapper = userInfoWrapper;
    const userInfoSlot = this.getSlot(USER_INFO_SLOT);
    userInfoWrapper.wrap(
        new UserInfo(userInfoSlot, false, null, false));

    const breadcrumbWrapper = new BreadcrumbWrapper();
    this.#breadcrumbWrapper = breadcrumbWrapper;
    const breadcrumbSlot = this.getSlot(BREADCRUMB_SLOT);
    breadcrumbWrapper.wrap(new Breadcrumb(
        breadcrumbSlot,
        false,
        false,
        [{name: 'Home'}],
    ));
    breadcrumbWrapper.onNavigateToFolder((folderId)=>{
      this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
        detail: {
          folderId: folderId,
        },
      }));
    });

    const searchRowWrapper = new SearchRowWrapper();
    this.#searchRowWrapper = searchRowWrapper;
    const searchRowSlot = this.getSlot(SEARCH_ROW_SLOT);
    searchRowWrapper.wrap(new SearchRow(searchRowSlot), (folderId, searchValue)=>{
      this.#eventTarget.dispatchEvent(new CustomEvent(SEARCH_EVENT, {
        detail: {
          folderId: folderId,
          searchValue: searchValue,
        },
      }));
    });

    const fileListWrapper = new FileListWrapper();
    this.#fileListWrapper = fileListWrapper;
    const fileListSlot = this.getSlot(FILE_LIST_SLOT);
    fileListWrapper.wrap(new FileList(fileListSlot, true, false, [], []));
    fileListWrapper.onNavigateToFolder((folderId)=>{
      this.#eventTarget.dispatchEvent(new CustomEvent(NAVIGATE_EVENT_FOLDER, {
        detail: {
          folderId: folderId,
        },
      }));
    });

    const buttonGroupWrapper = new ButtonGroupWrapper();
    this.#buttonGroupWrapper = buttonGroupWrapper;
    const buttonGroupSlot = this.getSlot(BUTTON_GROUP_SLOT);
    buttonGroupWrapper.wrap(new ButtonGroup(buttonGroupSlot));

    this.rootElement.querySelector('[data-td="logout-link"]').addEventListener('click', (event)=>{
      event.preventDefault();
      this.stateManagementService.dispatch(new LogOutUserAction());
    });
  }

  /**
   * @inheritDoc
   */
  onDestroy() {
    this.#userInfoWrapper.removeStateListeners();
    this.#breadcrumbWrapper.removeStateListeners();
    this.#fileListWrapper.removeStateListeners();
    this.#modalRemoveWrapper.removeStateListeners();
    this.#modalCreateWrapper.removeStateListeners();
  }

  /**
   * Adds listener on navigate to folder event.
   *
   * @param {function(string)}  listener
   */
  onNavigateToFolder(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_FOLDER, (event)=>{
      listener(event.detail.folderId);
    });
  }

  /**
   * Adds listener on search event.
   *
   * @param {function(string, string)}  listener
   */
  onSearch(listener) {
    this.#eventTarget.addEventListener(SEARCH_EVENT, (event) => {
      listener(event.detail.folderId, event.detail.searchValue);
    });
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
                ${this.addSlot(SEARCH_ROW_SLOT)}
            </div>
            ${this.addSlot(BUTTON_GROUP_SLOT)}
        </div>
        ${this.addSlot(FILE_LIST_SLOT)}
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
${this.addSlot(MODAL_REMOVE_SLOT)}
${this.addSlot(MODAL_CREATE_SLOT)}
</div>
    `;
  }
}
