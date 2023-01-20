import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {DefineRenamingItemAction} from '../../../src/state-management/folder/define-renaming-item-action';

describe('DefineRenamingItemAction', () => {
  test(`Should return expected sequence of mutator calls`, function() {
    expect.assertions(2);

    const action = new DefineRenamingItemAction({});

    const executor = jest.fn(() => {});

    action.execute(executor);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_RENAMING_ITEM, {});
  });
});
