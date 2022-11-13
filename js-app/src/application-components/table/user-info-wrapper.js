import {LoadUserAction} from '../../state-management/user/load-user-action';
import {StateManagementService} from '../../state-management/state-management-service';
import {UserInfo} from '../../components/user-info';

/**
 * Breadcrumb wrapper for state change listening.
 */
export class UserInfoWrapper {
  #stateManagementService;

  /**
   * @param {StateManagementService} stateManagementService
   */
  constructor(stateManagementService) {
    this.#stateManagementService = stateManagementService;

    stateManagementService.dispatch(new LoadUserAction());
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
