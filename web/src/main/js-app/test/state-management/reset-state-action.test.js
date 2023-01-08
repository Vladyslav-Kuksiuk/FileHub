import {MUTATOR_NAMES} from '../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {ResetStateAction} from '../../src/state-management/reset-state-action';

describe('ResetStateAction', () => {
  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(2);

    const action = new ResetStateAction();

    const executor = jest.fn(() => {});

    action.execute(executor);

    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor).toHaveBeenCalledWith( MUTATOR_NAMES.RESET_STATE);
  });
});
