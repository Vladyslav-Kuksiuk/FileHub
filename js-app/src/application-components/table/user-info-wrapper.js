import {LoadUserAction} from '../../state-management/user/load-user-action';
import {UserInfo} from '../../components/user-info';
import {ApplicationContext} from '../../application-context';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class UserInfoWrapper {
  #stateManagementService;

  /**
   * @param {ApplicationContext} applicationContext
   */
  constructor(applicationContext) {
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
}
