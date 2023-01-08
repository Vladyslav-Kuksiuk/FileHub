import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {ChangeCreationModalAction} from '../../../src/state-management/folder/change-creation-modal-action';

describe('ChangeCreationModalAction', () => {
  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(2);

    const action = new ChangeCreationModalAction(true);

    const executor = jest.fn(() => {});

    action.execute(executor);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_FOLDER_CREATION_MODAL_OPEN, true);
  });
});
