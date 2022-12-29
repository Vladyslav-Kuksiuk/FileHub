import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';
import {USER_PROFILE} from '../../../src/state-management/state';

describe('LoadUserAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
  });

  test(`Should return expected sequence of mutator calls`, function(done) {
    expect.assertions(3);

    const userProfile = {
      [USER_PROFILE.USERNAME]: 'testUser',
      [USER_PROFILE.ROOT_FOLDER_ID]: 'rootFolderId',
    };
    const mutatorCallStack = [];
    const expectedStack = [
      {mutator: MUTATOR_NAMES.SET_USER_PROFILE, payload: null},
      {mutator: MUTATOR_NAMES.SET_USER_PROFILE_ERROR, payload: null},
      {mutator: MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, payload: true},
      {mutator: MUTATOR_NAMES.SET_USER_PROFILE, payload: userProfile},
      {mutator: MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, payload: false},
    ];

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'loadUser')
        .mockImplementation(async ()=>{
          return userProfile;
        });

    const action = new LoadUserAction();

    const executor = jest.fn((mutator, payload)=>{
      mutatorCallStack.push({mutator, payload});
    });

    action.execute(executor, applicationContext);

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(executor).toBeCalledTimes(5);
      expect(mutatorCallStack).toStrictEqual(expectedStack);
      done();
    });
  });

  test(`Should return expected sequence of mutator calls`, function(done) {
    expect.assertions(3);

    const error = 'testError';
    const mutatorCallStack = [];
    const expectedStack = [
      {mutator: MUTATOR_NAMES.SET_USER_PROFILE, payload: null},
      {mutator: MUTATOR_NAMES.SET_USER_PROFILE_ERROR, payload: null},
      {mutator: MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, payload: true},
      {mutator: MUTATOR_NAMES.SET_USER_PROFILE_ERROR, payload: error},
      {mutator: MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, payload: false},
    ];

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'loadUser')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });

    const action = new LoadUserAction();

    const executor = jest.fn((mutator, payload)=>{
      mutatorCallStack.push({mutator, payload});
    });

    action.execute(executor, applicationContext);

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(executor).toBeCalledTimes(5);
      expect(mutatorCallStack).toStrictEqual(expectedStack);
      done();
    });
  });
});
