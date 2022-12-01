import {jest} from '@jest/globals';
import {StateAwareWrapper} from '../../src/application-components/state-aware-wrapper';
import {clearRegistry, registry} from '../../src/registry';

describe('StateAwareWrapper', () => {
  test('Should add and remove state listener', function() {
    clearRegistry();
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

    registry.register('stateManagementService', ()=>{
      return stateManagementService;
    });

    const wrapper = new StateAwareWrapper();
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
