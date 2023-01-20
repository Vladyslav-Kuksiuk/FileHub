import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {DefineRemovingItemAction} from '../../../src/state-management/folder/define-removing-item-action';

describe('DefineRemovingItemAction', () => {
  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(2);

    const action = new DefineRemovingItemAction({});

    const executor = jest.fn(() => {});

    action.execute(executor);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_REMOVING_ITEM, {});
  });
});
