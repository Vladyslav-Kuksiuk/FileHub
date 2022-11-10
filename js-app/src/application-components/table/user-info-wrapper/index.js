import {Component} from '../../../components/component';
import {StateManagementService} from '../../../state-management/state-management-service';
import {UserInfo} from '../../../components/user-info';
import {LoadUserAction} from '../../../state-management/user/load-user-action';

/**
 * User panel component with state listening.
 */
export class UserInfoWrapper extends Component {
  #stateManagementService;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   */
  constructor(parent, stateManagementService) {
    super(parent);

    this.#stateManagementService = stateManagementService;
    stateManagementService.dispatch(new LoadUserAction());
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const userInfo = new UserInfo(this.rootElement, true, null, null);

    this.#stateManagementService.addStateListener('userProfile', (state) => {
      userInfo.username = state.userProfile?.username;
    });
    this.#stateManagementService.addStateListener('isUserProfileLoading', (state) => {
      userInfo.isLoading = state.isUserProfileLoading;
    });
    this.#stateManagementService.addStateListener('userProfileError', (state) => {
      userInfo.hasError = !!state.userProfileError;
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return '<slot></slot>';
  }
}
