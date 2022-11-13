import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LogOutUserAction} from '../../../src/state-management/user/log-out-user-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';

describe('LogOutUserAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
  });

  test(`Should call executor with user profile`, function() {
    expect.assertions(3);

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'logOut')
        .mockImplementation(async ()=>{});

    const action = new LogOutUserAction();

    const executor = jest.fn(()=>{});

    return action.execute(executor, applicationContext).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledWith(MUTATOR_NAMES.SET_USER_PROFILE, null);
    });
  });

  test(`Should call executor with error`, function() {
    expect.assertions(3);

    const errorMessage = 'error';

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'logOut')
        .mockImplementation(async ()=>{
          throw new Error(errorMessage);
        });

    const action = new LogOutUserAction();

    const executor = jest.fn(()=>{});

    return action.execute(executor, applicationContext).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledWith(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, errorMessage);
    });
  });
});
