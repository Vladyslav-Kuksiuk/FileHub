import {ApiService} from '../../../src/server-connection/api-service';
import {RequestService} from '../../../src/server-connection/request-service';
import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LogOutUserAction} from '../../../src/state-management/user/log-out-user-action.js';
import {jest} from '@jest/globals';

describe('LogOutUserAction', () => {
  test(`Should return new state with changed 'isUserLoading'`, function(done) {
    expect.assertions(3);

    const apiService = new ApiService(new RequestService);
    const apiServiceMock = jest
      .spyOn(apiService, 'logOut')
      .mockImplementation(async ()=>{});

    const action = new LogOutUserAction({}, apiService);

    const executor = jest.fn((mutator, payload)=>{});

    action.execute(executor);

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(executor).toBeCalledTimes(1);
      expect(executor).toBeCalledWith(MUTATOR_NAMES.SET_USERNAME, null)
      done();
    });
  });
});
