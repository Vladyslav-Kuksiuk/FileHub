import {LoadUserAction} from '../../state-management/user/load-user-action';
import {UserInfo} from '../../components/user-info';
import {inject} from '../../registry';

/**
 * UserInfo wrapper for state change listening.
 */
export class UserInfoWrapper extends StateAwareWrapper {
  @inject #stateManagementService;

  /**
   * Constructor.
   */
  constructor() {
    super(this.#stateManagementService)
    const state = this.#stateManagementService.state;
    if (state.userProfile == null && !state.isUserProfileLoading) {
      this.#stateManagementService.dispatch(new LoadUserAction());
    }
  }

  /**
   * Adds state listeners to UserInfo component.
   *
   * @param {UserInfo} userInfo
   */
  wrap(userInfo) {
    this.addStateListener('userProfile', (state) => {
      userInfo.username = state.userProfile?.username;
    });

    this.addStateListener('isUserProfileLoading', (state) => {
      userInfo.isLoading = state.isUserProfileLoading;
    });

    this.addStateListener('userProfileError', (state) => {
          userInfo.hasError = !!state.userProfileError;
        });

  }
}
