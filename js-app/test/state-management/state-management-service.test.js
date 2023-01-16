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
          executor('change', !state.isChanged);
        });
  });

  test('Should return error on constructor without state', function() {
    expect.assertions(1);
    expect(()=>{
      new StateManagementService({}, undefined, {});
    }).toThrow(new Error('Initial state is not valid'));
  });

  test(`Should successfully change state`, function() {
    expect.assertions(3);

    expect(stateManagementService.state.isChanged).toBeFalsy();
    stateManagementService.dispatch(action);
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(stateManagementService.state.isChanged).toBeTruthy();
  });

  test(`Should successfully trigger state event`, function() {
    expect.assertions(3);

    const listenerMock = jest.fn();
    stateManagementService.addStateListener('isChanged', listenerMock);
    stateManagementService.dispatch(action);
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(listenerMock).toHaveBeenCalledTimes(2);
    expect(stateManagementService.state.isChanged).toBeTruthy();
  });
});
