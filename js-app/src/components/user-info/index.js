import {Component} from '../component';
import {LoadUserAction} from '../../state-management/user/load-user-action';
import {StateManagementService} from '../../state-management/state-management-service';

const LINK_CLICK_EVENT = 'LINK_CLICK_EVENT';

/**
 * User panel component.
 */
export class UserInfo extends Component {
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
    this.#stateManagementService.addStateListener('username', (state)=>{
      this.#setUsername(state.username);
    });
    this.#stateManagementService.addStateListener('isUserLoading', (state)=>{
      this.#setIsLoading(state.isUserLoading);
    });
    this.#stateManagementService.dispatch(new LoadUserAction());
    this.init();
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
            <slot>
                <span aria-hidden="true" class="glyphicon glyphicon-user"></span>
                <span>${this.#username}</span>
            </slot>
      `;
    }

    return `${userData}`;
  }
}
