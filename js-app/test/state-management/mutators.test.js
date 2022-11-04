import {MUTATORS, MUTATOR_NAMES} from '../../src/state-management/mutators';
import {STATE, USER_PROFILE} from '../../src/state-management/state';

describe('Mutators', () => {
  let state;

  beforeEach(() => {
    state = {
      [STATE.IS_USER_PROFILE_LOADING]: false,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
    };
  });

  test(`Should return new state with changed 'isUserLoading'`, function() {
    expect.assertions(2);

    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING](state, true);

    expect(state[STATE.IS_USER_PROFILE_LOADING]).toBeFalsy();
    expect(newState[STATE.IS_USER_PROFILE_LOADING]).toBeTruthy();
  });

  test(`Should return new state with changed 'username'`, function() {
    expect.assertions(2);

    const userProfile = {
      [USER_PROFILE.USERNAME]: 'username',
      [USER_PROFILE.ROOT_FOLDER_ID]: '3123',
    };

    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_PROFILE](state, userProfile);

    expect(state[STATE.USER_PROFILE]).toBeNull();
    expect(newState[STATE.USER_PROFILE]).toStrictEqual(userProfile);
  });

  test(`Should return new state with changed 'userError'`, function() {
    expect.assertions(2);

    const error = 'error';
    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_PROFILE_ERROR](state, error);

    expect(state[STATE.USER_PROFILE_ERROR]).toBeNull();
    expect(newState[STATE.USER_PROFILE_ERROR]).toBe(error);
  });
});
