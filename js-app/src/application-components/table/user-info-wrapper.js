import {LoadUserAction} from '../../state-management/user/load-user-action';
import {UserInfo} from '../../components/user-info';
import {ApplicationContext} from '../application-context';
import {StateAwareWrapper} from '../state-aware-wrapper';

/**
 * UserInfo wrapper for state change listening.
 */
export class UserInfoWrapper extends StateAwareWrapper {
  #stateManagementService;

  /**
   * @param {ApplicationContext} applicationContext
   */
  constructor(applicationContext) {
    super(applicationContext.stateManagementService);
    this.#stateManagementService = applicationContext.stateManagementService;
    const state = applicationContext.stateManagementService.state;
    if (state.userProfile == null && !state.isUserProfileLoading) {
      this.#stateManagementService.dispatch(new LoadUserAction(applicationContext.apiService));
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
