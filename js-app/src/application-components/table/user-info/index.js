import {Component} from '../../../components/component';
import {StateManagementService} from '../../../state-management/state-management-service';
import {STATE, USER_PROFILE} from '../../../state-management/state';

/**
 * User panel component.
 */
export class UserInfo extends Component {
  #stateManagementService;
  #error;
  #username;
  #isLoading;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   */
  constructor(parent, stateManagementService) {
    super(parent);

    const state = stateManagementService.state;
    this.#error = state[STATE.USER_PROFILE_ERROR];
    this.#username = state[STATE.USER_PROFILE]?.[USER_PROFILE.USERNAME];
    this.#isLoading = state[STATE.IS_USER_PROFILE_LOADING];

    this.#stateManagementService = stateManagementService;
    this.#stateManagementService.addStateListener(STATE.USER_PROFILE, (state) => {
      this.#setUsername(state[STATE.USER_PROFILE]?.[USER_PROFILE.USERNAME]);
    });
    this.#stateManagementService.addStateListener(STATE.IS_USER_PROFILE_LOADING, (state) => {
      this.#setIsLoading(state[STATE.IS_USER_PROFILE_LOADING]);
    });
    this.#stateManagementService.addStateListener(STATE.USER_PROFILE_ERROR, (state) => {
      this.#setError(state[STATE.USER_PROFILE_ERROR]);
    });
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
    let userData;
    if (this.#isLoading) {
      userData = `<span ${this.markElement('user-info-loading')}
                     aria-hidden="true" class="glyphicon glyphicon-repeat"></span>`;
    } else if (this.#error) {
      userData = `<span ${this.markElement('user-info-error')} class="text-danger"> 
                    <span class="glyphicon glyphicon-exclamation-sign"></span>
                        Can't load user data</span>`;
    } else {
      userData = `
            <slot>
                <span aria-hidden="true" class="glyphicon glyphicon-user"></span>
                <span ${this.markElement('user-info-username')}>${this.#username}</span>
            </slot>
      `;
    }

    return `${userData}`;
  }
}
