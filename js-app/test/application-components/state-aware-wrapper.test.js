import {jest} from '@jest/globals';
import {StateAwareWrapper} from '../../src/application-components/state-aware-wrapper';

describe('StateAwareWrapper', () => {
  test('Should add and remove state listener', function() {
    expect.assertions(4);

    const addStateListenerMock = jest.fn((field, listener)=>{
      return {
        field: field,
        listener: listener,
      };
    });
    const removeStateListenerMock = jest.fn();

    const stateManagementService = {
      addStateListener: addStateListenerMock,
      removeStateListener: removeStateListenerMock,
    };

    const wrapper = new StateAwareWrapper(stateManagementService);
    const field = 'field';
    const listener = ()=>{};

    wrapper.addStateListener(field, listener);
    wrapper.removeStateListeners();

    expect(addStateListenerMock).toHaveBeenCalledTimes(1);
    expect(addStateListenerMock).toHaveBeenCalledWith(field, listener);
    expect(removeStateListenerMock).toHaveBeenCalledTimes(1);
    expect(removeStateListenerMock).toHaveBeenCalledWith(field, listener);
  });
});
