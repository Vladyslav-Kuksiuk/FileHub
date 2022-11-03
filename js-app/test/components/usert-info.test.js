import {ApplicationContext} from '../../src/application-context';
import {StateManagementService} from '../../src/state-management/state-management-service';
import {UserInfo} from '../../src/components/user-info/index';
import {MUTATORS} from '../../src/state-management/mutators';
import {jest} from '@jest/globals';

describe('UserInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should change UserInfo states`, function() {
    expect.assertions(5);

    const username = 'test username';
    const error = 'error text';

    const state = {
      isUserLoading: true,
      username: null,
      userError: null,
    };

    const applicationContext = new ApplicationContext();
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    const fieldListeners = {
      isUserLoading: null,
      username: null,
      userError: null,
    };

    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener) => {
          fieldListeners[field] = listener;
        });

    new UserInfo(document.body, stateManagementService);

    state.isUserLoading = true;
    fieldListeners.isUserLoading(state);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(1);

    state.username = username;
    state.isUserLoading = false;
    fieldListeners.isUserLoading(state);
    fieldListeners.username(state);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(0);
    expect(document.body.querySelector('[data-td="user-info-username"]').textContent).toBe(username);

    state.userError = error;
    fieldListeners.userError(state);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(0);
    expect(document.body.querySelectorAll('[data-td="user-info-error"]').length).toBe(1);
  });
});
