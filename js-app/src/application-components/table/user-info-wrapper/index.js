import {Component} from '../../../components/component';
import {StateManagementService} from '../../../state-management/state-management-service';
import {STATE} from '../../../state-management/state';
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

    this.#stateManagementService.addStateListener(STATE.USER_PROFILE, (state) => {
      userInfo.username = state[STATE.USER_PROFILE]?.username;
    });
    this.#stateManagementService.addStateListener(STATE.IS_USER_PROFILE_LOADING, (state) => {
      userInfo.isLoading = state[STATE.IS_USER_PROFILE_LOADING];
    });
    this.#stateManagementService.addStateListener(STATE.USER_PROFILE_ERROR, (state) => {
      userInfo.hasError = !!state[STATE.USER_PROFILE_ERROR];
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return '<slot></slot>';
  }
}
