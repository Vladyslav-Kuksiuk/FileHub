import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';
import {STATE, USER_PROFILE} from '../../../src/state-management/state';

describe('LoadUserAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
  });

  test(`Should return expected sequence of successfully mutator calls`, function() {
    expect.assertions(5);

    const userProfile = {
      [USER_PROFILE.USERNAME]: 'testUser',
      [USER_PROFILE.ROOT_FOLDER_ID]: 'rootFolderId',
    };

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'loadUser')
        .mockImplementation(async ()=>{
          return {[STATE.USER_PROFILE]: userProfile};
        });

    const action = new LoadUserAction();

    const executor = jest.fn(()=>{});

    return action.execute(executor, applicationContext).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_USER_PROFILE, userProfile);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, false);
    });
  });

  test(`Should return expected sequence of failed mutator calls`, function() {
    expect.assertions(5);

    const error = 'testError';

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'loadUser')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });

    const action = new LoadUserAction();

    const executor = jest.fn(()=>{});

    return action.execute(executor, applicationContext).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_USER_PROFILE_ERROR, error);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, false);
    });
  });
});
