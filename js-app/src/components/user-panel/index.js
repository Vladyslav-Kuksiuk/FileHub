import {Component} from '../component';
import {StateManagementService} from '../../state-management/state-management-service';
import {LoadUserAction} from '../../state-management/user/load-user-action';

const LINK_CLICK_EVENT = 'LINK_CLICK_EVENT';

/**
 * User panel component.
 */
export class UserPanel extends Component {
  #eventTarget = new EventTarget();
  #stateManagementService;
  #username = '';
  #isLoading = true;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   */
  constructor(parent, stateManagementService) {
    super(parent);
    this.#stateManagementService = stateManagementService;
    stateManagementService.addStateListener('username', ()=>{
      this.#setUsername(this.#stateManagementService.state.username);
    });
    stateManagementService.addStateListener('isUserLoading', ()=>{
      this.#setIsLoading(this.#stateManagementService.state.isUserLoading);
    });
    stateManagementService.dispatch(new LoadUserAction({}));
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.querySelector('a').addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(LINK_CLICK_EVENT));
    });
  }

  /**
   * @param {string} username
   * @private
   */
  #setUsername(username) {
    this.#username = username;
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
   * Adds listener on link click event.
   *
   * @param {Function} listener
   */
  onLinkClick(listener) {
    this.#eventTarget.addEventListener(LINK_CLICK_EVENT, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    let userData;
    if (this.#isLoading) {
      userData = '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>';
    } else {
      userData = `
                <span aria-hidden="true" class="glyphicon glyphicon-user"></span>
                <span>${this.#username}</span>
      `;
    }

    return `
    <ul ${this.markElement('user-panel-component')} class="authorized-user-panel">
            <li>
                ${userData}
            </li>
            <li>
                <a class="logout-button" href="/" title="Log Out">
                    Log Out
                    <span aria-hidden="true" class="glyphicon glyphicon-log-out"></span>
                </a>
            </li>
        </ul>
    `;
  }
}
