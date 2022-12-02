import {jest} from '@jest/globals';
import {clearRegistry, registry} from '../src/registry';

describe('Registry', () => {
  test(`Should add dependency creator and give same dependency`, function() {
    expect.assertions(3);

    let counter = 0;
    const dependencyName = 'counter';

    const creatorMock = jest.fn(() => {
      return ++counter;
    });

    registry.register(dependencyName, creatorMock);

    const value1 = registry.getInstance(dependencyName);
    const value2 = registry.getInstance(dependencyName);

    expect(creatorMock).toHaveBeenCalledTimes(1);
    expect(value1).toBe(1);
    expect(value2).toBe(1);
    clearRegistry();
  });

  test(`Should throw error after unregistered dependency called`, function() {
    expect.assertions(1);

    expect(()=>{
      registry.getInstance('error');
    }).toThrow(new Error('Unknown component name: error'));
  });
});
