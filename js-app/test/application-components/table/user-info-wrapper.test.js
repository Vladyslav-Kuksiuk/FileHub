import {StateManagementService} from '../../../src/state-management/state-management-service';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {UserInfoWrapper} from '../../../src/application-components/table/user-info-wrapper';
import {UserInfo} from '../../../src/components/user-info';
import {jest} from '@jest/globals';

describe('UserInfoWrapper', () => {
  let stateManagementService;
  let stateListeners = {};
  let dispatchMock;

  beforeEach(() => {
    stateManagementService = new StateManagementService({}, {}, {});

    stateListeners = {};
    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
        });
    dispatchMock = jest.spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should dispatch LoadUserAction`, function() {
    expect.assertions(2);

    new UserInfoWrapper(stateManagementService);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new LoadUserAction);
  });

  test(`Should add state listeners`, function() {
    expect.assertions(6);

    const wrapper = new UserInfoWrapper(stateManagementService);
    const userInfo = new UserInfo(document.body, false, null, false);

    const isLoadingMock = jest.spyOn(userInfo, 'isLoading', 'set').mockImplementation(()=>{});
    const hasErrorMock = jest.spyOn(userInfo, 'hasError', 'set').mockImplementation(()=>{});
    const pathMock = jest.spyOn(userInfo, 'username', 'set').mockImplementation(()=>{});

    wrapper.wrap(userInfo);
    expect(Object.keys(stateListeners)).toContain('isUserProfileLoading');
    expect(Object.keys(stateListeners)).toContain('userProfile');
    expect(Object.keys(stateListeners)).toContain('userProfileError');

    const userProfileState = {
      userProfile: {
        username: 'test',
      },
    };

    stateListeners.isUserProfileLoading?.({});
    stateListeners.userProfile?.(userProfileState);
    stateListeners.userProfileError?.({});

    expect(isLoadingMock).toHaveBeenCalledTimes(1);
    expect(hasErrorMock).toHaveBeenCalledTimes(1);
    expect(pathMock).toHaveBeenCalledTimes(1);
  });
});
