import {StateManagementService} from '../../src/state-management/state-management-service';
import {Action} from '../../src/state-management/action';
import {jest} from '@jest/globals';

describe('StateManagementService', () => {
  let action;
  let actionMock;
  let stateManagementService;

  beforeEach(() => {
    const state = {isChanged: false};
    const mutators = {
      change: (state, isChanged) =>{
        return {...state, isChanged: isChanged};
      }};

    stateManagementService = new StateManagementService(mutators, state);

    action = new Action({});
    actionMock = jest
        .spyOn(action, 'execute')
        .mockImplementation((executor) => {
          executor('change', true);
        });
  });

  test(`Should successfully change state`, function() {
    expect.assertions(3);

    expect(stateManagementService.state.isChanged).toBeFalsy();
    stateManagementService.dispatch(action);
    expect(actionMock).toBeCalledTimes(1);
    expect(stateManagementService.state.isChanged).toBeTruthy();
  });

  test(`Should successfully trigger state event`, function(done) {
    expect.assertions(4);

    expect(stateManagementService.state.isChanged).toBeFalsy();
    stateManagementService.addStateListener('isChanged', (state)=>{
      expect(state.isChanged).toBeTruthy();
      done();
    });
    stateManagementService.dispatch(action);
    expect(actionMock).toBeCalledTimes(1);
    expect(stateManagementService.state.isChanged).toBeTruthy();
  });
});
