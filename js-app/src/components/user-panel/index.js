import {Component} from '../component';
import {LoadUserAction} from '../../state-management/user/load-user-action';
import {ApplicationContext} from '../../application-context';

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
   * @param {ApplicationContext} applicationContext
   */
  constructor(parent, applicationContext) {
    super(parent);
    this.#stateManagementService = applicationContext.stateManagementService;
    this.#stateManagementService.addStateListener('username', (state)=>{
      this.#setUsername(state.username);
    });
    this.#stateManagementService.addStateListener('isUserLoading', (state)=>{
      this.#setIsLoading(state.isUserLoading);
    });
    this.#stateManagementService.dispatch(new LoadUserAction({}, applicationContext.apiService));
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
