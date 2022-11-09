import {MUTATORS, MUTATOR_NAMES} from '../../src/state-management/mutators';
import {STATE} from '../../src/state-management/state';
import {FolderInfo} from '../../src/state-management/folder/folder-info.js';
import {UserProfile} from '../../src/state-management/user/user-profile.js';

describe('Mutators', () => {
  let state;

  beforeEach(() => {
    state = {
      [STATE.IS_USER_PROFILE_LOADING]: false,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
      [STATE.IS_FOLDER_INFO_LOADING]: false,
      [STATE.FOLDER_INFO]: null,
      [STATE.FOLDER_INFO_ERROR]: null,
    };
  });

  test(`Should return new state with changed ${STATE.IS_USER_PROFILE_LOADING}`, function() {
    expect.assertions(2);

    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING](state, true);

    expect(state[STATE.IS_USER_PROFILE_LOADING]).toBe(false);
    expect(newState[STATE.IS_USER_PROFILE_LOADING]).toBe(true);
  });

  test(`Should return new state with changed  ${STATE.USER_PROFILE}`, function() {
    expect.assertions(2);

    const userProfile = new UserProfile(
        'testUser',
        'rootFolderId',
    );

    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_PROFILE](state, userProfile);

    expect(state[STATE.USER_PROFILE]).toBeNull();
    expect(newState[STATE.USER_PROFILE]).toStrictEqual(userProfile);
  });

  test(`Should return new state with changed  ${STATE.USER_PROFILE_ERROR}`, function() {
    expect.assertions(2);

    const error = 'error';
    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_PROFILE_ERROR](state, error);

    expect(state[STATE.USER_PROFILE_ERROR]).toBeNull();
    expect(newState[STATE.USER_PROFILE_ERROR]).toBe(error);
  });

  test(`Should return new state with changed  ${STATE.IS_FOLDER_INFO_LOADING}`, function() {
    expect.assertions(2);

    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING](state, true);

    expect(state[STATE.IS_FOLDER_INFO_LOADING]).toBe(false);
    expect(newState[STATE.IS_FOLDER_INFO_LOADING]).toBe(true);
  });

  test(`Should return new state with changed  ${STATE.FOLDER_INFO}`, function() {
    expect.assertions(2);

    const folderInfo = new FolderInfo(
        'folder',
        'ID',
        'parentId',
        1,
    );

    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_INFO](state, folderInfo);

    expect(state[STATE.FOLDER_INFO]).toBeNull();
    expect(newState[STATE.FOLDER_INFO]).toStrictEqual(folderInfo);
  });

  test(`Should return new state with changed  ${STATE.FOLDER_INFO_ERROR}`, function() {
    expect.assertions(2);

    const error = 'error';
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_INFO_ERROR](state, error);

    expect(state[STATE.FOLDER_INFO_ERROR]).toBeNull();
    expect(newState[STATE.FOLDER_INFO_ERROR]).toBe(error);
  });
});
