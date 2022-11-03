import {Component} from '../component';
import {StateManagementService} from '../../state-management/state-management-service';

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
    this.#error = state.userError;
    this.#username = state.username;
    this.#isLoading = state.isUserLoading;

    this.#stateManagementService = stateManagementService;
    this.#stateManagementService.addStateListener('username', (state) => {
      this.#setUsername(state.username);
    });
    this.#stateManagementService.addStateListener('isUserLoading', (state) => {
      this.#setIsLoading(state.isUserLoading);
    });
    this.#stateManagementService.addStateListener('userError', (state) => {
      this.#setError(state.userError);
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
