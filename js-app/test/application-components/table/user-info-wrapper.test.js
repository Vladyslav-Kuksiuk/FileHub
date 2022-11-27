import {ApplicationContext} from '../../../src/application-components/application-context';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {UserInfoWrapper} from '../../../src/application-components/table/user-info-wrapper';
import {UserInfo} from '../../../src/components/user-info';
import {jest} from '@jest/globals';

describe('UserInfoWrapper', () => {
  let applicationContext;
  let stateListeners = {};
  let dispatchMock;

  beforeEach(() => {
    applicationContext = new ApplicationContext();

    stateListeners = {};
    jest.spyOn(applicationContext.stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
        });
    dispatchMock = jest.spyOn(applicationContext.stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should dispatch LoadUserAction`, function() {
    expect.assertions(2);

    new UserInfoWrapper(applicationContext);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new LoadUserAction(applicationContext.apiService));
  });

  test(`Should add state listeners`, function() {
    expect.assertions(6);

    const wrapper = new UserInfoWrapper(applicationContext);
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
