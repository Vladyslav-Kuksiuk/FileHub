import {ApplicationContext} from '../../src/application-context';
import {StateManagementService} from '../../src/state-management/state-management-service';
import {UserInfo} from '../../src/application-components/table/user-info/index';
import {MUTATORS} from '../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {STATE} from '../../src/state-management/state';
import {UserProfile} from '../../src/state-management/user/user-profile';

describe('UserInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should change UserInfo states`, function() {
    expect.assertions(5);
    const userProfile = new UserProfile(
        'username',
        '123',
    );

    const error = 'error text';

    const state = {
      [STATE.IS_USER_PROFILE_LOADING]: true,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
    };

    const applicationContext = new ApplicationContext();
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    const fieldListeners = {
      [STATE.IS_USER_PROFILE_LOADING]: null,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
    };

    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener) => {
          fieldListeners[field] = listener;
        });

    new UserInfo(document.body, stateManagementService);

    state[STATE.IS_USER_PROFILE_LOADING] = true;
    fieldListeners[STATE.IS_USER_PROFILE_LOADING](state);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(1);

    state[STATE.USER_PROFILE] = userProfile;
    state[STATE.IS_USER_PROFILE_LOADING] = false;
    fieldListeners[STATE.IS_USER_PROFILE_LOADING](state);
    fieldListeners[STATE.USER_PROFILE](state);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(0);
    expect(document.body.querySelector('[data-td="user-info-username"]').textContent)
        .toBe(userProfile.username);

    state[STATE.USER_PROFILE_ERROR] = error;
    fieldListeners[STATE.USER_PROFILE_ERROR](state);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(0);
    expect(document.body.querySelectorAll('[data-td="user-info-error"]').length).toBe(1);
  });
});
