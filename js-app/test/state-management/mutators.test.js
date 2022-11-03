import {MUTATORS, MUTATOR_NAMES} from '../../src/state-management/mutators';

describe('Mutators', () => {
  let state;

  beforeEach(() => {
    state = {
      isUserLoading: false,
      username: null,
      userError: null,
    };
  });

  test(`Should return new state with changed 'isUserLoading'`, function() {
    expect.assertions(2);

    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_USER_LOADING](state, true);

    expect(state.isUserLoading).toBeFalsy();
    expect(newState.isUserLoading).toBeTruthy();
  });

  test(`Should return new state with changed 'username'`, function() {
    expect.assertions(2);

    const username = 'username';

    const newState = MUTATORS[MUTATOR_NAMES.SET_USERNAME](state, username);

    expect(state.username).toBeNull();
    expect(newState.username).toBe(username);
  });

  test(`Should return new state with changed 'userError'`, function() {
    expect.assertions(2);

    const error = 'error';
    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_ERROR](state, error);

    expect(state.userError).toBeNull();
    expect(newState.userError).toBe(error);
  });
});
