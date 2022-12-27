import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LogOutUserAction} from '../../../src/state-management/user/log-out-user-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';

describe('LogOutUserAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
  });

  test(`Should successfully logOut`, function(done) {
    expect.assertions(3);

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'logOut')
        .mockImplementation(async ()=>{});

    const action = new LogOutUserAction();

    const executor = jest.fn((mutator, payload)=>{});

    action.execute(executor, applicationContext);

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(executor).toBeCalledTimes(1);
      expect(executor).toBeCalledWith(MUTATOR_NAMES.SET_USER_PROFILE, null);
      done();
    });
  });
});
