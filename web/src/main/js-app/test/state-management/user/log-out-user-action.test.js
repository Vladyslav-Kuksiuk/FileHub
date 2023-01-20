import {LogOutUserAction} from '../../../src/state-management/user/log-out-user-action';
import {jest} from '@jest/globals';
import {clearRegistry, registry} from '../../../src/registry';


describe('LogOutUserAction', () => {
  let apiService;

  beforeEach(()=>{
    clearRegistry();
    apiService = {
      logOut: () => {},
    };

    registry.register('apiService', () => {
      return apiService;
    });
  });

  test(`Should call logOut in apiService`, function() {
    expect.assertions(2);

    const apiServiceMock = jest
        .spyOn(apiService, 'logOut')
        .mockImplementation(async ()=>{});

    const action = new LogOutUserAction();

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(0);
    });
  });
});
