import {MUTATOR_NAMES, MUTATORS} from '../../src/state-management/mutators';
import {State} from '../../src/state-management/state';
import {FolderInfo} from '../../src/state-management/folder/folder-info';
import {UserProfile} from '../../src/state-management/user/user-profile';

describe('Mutators', () => {
  let state;

  beforeEach(() => {
    state = new State();
  });

  test(`Should return new state with changed isUserProfileLoading`, function() {
    expect.assertions(1);

    const expectedState = new State({
      isUserProfileLoading: false,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING](state, false);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isUserProfileLoading and nulled userProfile and userProfileError`,
      function() {
        expect.assertions(1);

        const state = new State({
          isUserProfileLoading: false,
          userProfile: {},
          userProfileError: {},
        });

        const expectedState = new State({
          isUserProfileLoading: true,
          userProfile: null,
          userProfileError: null,
        });
        const newState = MUTATORS[MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING](state, true);

        expect(newState).toStrictEqual(expectedState);
      });

  test(`Should return new state with changed userProfile`, function() {
    expect.assertions(1);

    const userProfile = new UserProfile(
        'testUser',
        'rootFolderId',
    );
    const expectedState = new State({
      userProfile: userProfile,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_PROFILE](state, userProfile);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed userProfileError`, function() {
    expect.assertions(1);

    const error = 'error';
    const expectedState = new State({
      userProfileError: error,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_USER_PROFILE_ERROR](state, error);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isFolderInfoLoading`, function() {
    expect.assertions(1);

    const expectedState = new State({
      isFolderInfoLoading: false,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING](state, false);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isFolderInfoLoading and nulled folderInfo and folderInfoError`,
      function() {
        expect.assertions(1);

        const state = new State({
          isFolderInfoLoading: false,
          folderInfo: {},
          folderInfoError: {},
        });

        const expectedState = new State({
          isFolderInfoLoading: true,
          folderInfo: null,
          folderInfoError: null,
        });
        const newState = MUTATORS[MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING](state, true);

        expect(newState).toStrictEqual(expectedState);
      });

  test(`Should return new state with changed folderInfo`, function() {
    expect.assertions(1);

    const folderInfo = new FolderInfo(
        'folder',
        'ID',
        'parentId',
        1,
    );

    const expectedState = new State({
      folderInfo: folderInfo,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_INFO](state, folderInfo);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderInfoError`, function() {
    expect.assertions(1);

    const error = 'error';
    const expectedState = new State({
      folderInfoError: error,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_INFO_ERROR](state, error);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isFolderContentLoading`, function() {
    expect.assertions(1);

    const expectedState = new State({
      isFolderContentLoading: false,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING](state, false);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isFolderContentLoading and nulled folderContent and folderContentError`,
      function() {
        expect.assertions(1);

        const state = new State({
          isFolderContentLoading: false,
          folderContent: {},
          folderContentError: {},
        });

        const expectedState = new State({
          isFolderContentLoading: true,
          folderContent: null,
          folderContentError: null,
        });
        const newState = MUTATORS[MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING](state, true);

        expect(newState).toStrictEqual(expectedState);
      });

  test(`Should return new state with changed folderContent`, function() {
    expect.assertions(1);

    const expectedState = new State({
      folderContent: {},
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_CONTENT](state, {});

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderContent without renamingItem`, function() {
    expect.assertions(1);

    state = {
      isItemRenaming: true,
    };

    const expectedState = new State({
      folderContent: {},
      renamingItem: null,
      isItemRenaming: true,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_CONTENT](state, {});

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderContentError`, function() {
    expect.assertions(1);

    const error = 'error';
    const expectedState = new State({
      folderContentError: error,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR](state, error);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed locationMetadata`, function() {
    expect.assertions(1);

    const locationMetadata = {
      folderId: '123',
    };
    const expectedState = new State({
      locationMetadata: locationMetadata,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_LOCATION_METADATA](state, locationMetadata);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed itemInRemovingState`, function() {
    expect.assertions(1);

    const itemInRemovingState = {
      name: '123',
    };
    const prevState = new State({
      itemDeletingError: 'error',
    });

    const expectedState = new State({
      itemInRemovingState: itemInRemovingState,
      itemDeletingError: null,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_REMOVING_ITEM](prevState, itemInRemovingState);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isItemDeleting and itemDeletingError`, function() {
    expect.assertions(1);

    const prevState = new State({
      itemDeletingError: 'error',
    });

    const expectedState = new State({
      isItemDeleting: true,
      itemDeletingError: null,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_ITEM_DELETING](prevState, true);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isItemDeleting`, function() {
    expect.assertions(1);

    const prevState = new State({
      isItemDeleting: true,
      itemDeletingError: 'error',
    });

    const expectedState = new State({
      isItemDeleting: false,
      itemDeletingError: 'error',
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_ITEM_DELETING](prevState, false);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isItemDeleting and itemInRemovingState`, function() {
    expect.assertions(1);

    const prevState = new State({
      isItemDeleting: true,
      itemInRemovingState: {},
    });

    const expectedState = new State({
      isItemDeleting: false,
      itemInRemovingState: null,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_ITEM_DELETING](prevState, false);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed itemDeletingError`, function() {
    expect.assertions(1);

    const expectedState = new State({
      itemDeletingError: 'error',
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_ITEM_DELETING_ERROR](state, 'error');

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isFolderCreationModalOpen`, function() {
    expect.assertions(1);

    const prevState = new State({
      folderCreationError: 'error',
    });

    const expectedState = new State({
      isFolderCreationModalOpen: true,
      folderCreationError: null,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_FOLDER_CREATION_MODAL_OPEN](prevState, true);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderInCreationState and folderCreationError`, function() {
    expect.assertions(1);

    const prevState = new State({
      folderCreationError: 'error',
    });

    const expectedState = new State({
      folderInCreationState: {},
      folderCreationError: null,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE](prevState, {});

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderInCreationState`, function() {
    expect.assertions(1);

    const prevState = new State({
      folderInCreationState: {},
      folderCreationError: 'error',
    });

    const expectedState = new State({
      folderInCreationState: null,
      folderCreationError: 'error',
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE](prevState, null);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderInCreationState and isFolderCreationModalOpen`, function() {
    expect.assertions(1);

    const prevState = new State({
      folderInCreationState: {},
      isFolderCreationModalOpen: true,
    });

    const expectedState = new State({
      folderInCreationState: null,
      isFolderCreationModalOpen: false,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE](prevState, null);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed folderCreationError`, function() {
    expect.assertions(1);

    const expectedState = new State({
      folderCreationError: 'error',
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_FOLDER_CREATION_ERROR](state, 'error');

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with added foldersToUpload`, function() {
    expect.assertions(1);

    const folderId = '123';

    const expectedState = new State({
      foldersToUpload: [folderId],
      filesUploadingErrorInfo: {
        [folderId]: undefined,
      },
    });
    const newState = MUTATORS[MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD](state, folderId);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with removed foldersToUpload`, function() {
    expect.assertions(1);

    const folderId = '123';

    state = new State({
      foldersToUpload: [folderId],
    });

    const expectedState = new State({
      foldersToUpload: [],
    });

    const newState = MUTATORS[MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD](state, folderId);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with added filesUploadingErrorInfo`, function() {
    expect.assertions(1);

    const errorInfo = {
      folderId: '123',
      error: 'error',
    };

    const expectedState = new State({
      filesUploadingErrorInfo: {
        [errorInfo.folderId]: errorInfo.error,
      },
    });
    const newState = MUTATORS[MUTATOR_NAMES.ADD_FILES_UPLOADING_ERROR_INFO](state, errorInfo);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with added downloadingFiles`, function() {
    expect.assertions(1);

    const fileId = '123';

    const expectedState = new State({
      downloadingFiles: [fileId],
      filesDownloadingError: {
        [fileId]: undefined,
      },
    });
    const newState = MUTATORS[MUTATOR_NAMES.ADD_DOWNLOADING_FILE](state, fileId);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with removed downloadingFiles`, function() {
    expect.assertions(1);

    const fileId = '123';

    state = new State({
      downloadingFiles: [fileId],
    });

    const expectedState = new State({
      downloadingFiles: [],
    });

    const newState = MUTATORS[MUTATOR_NAMES.REMOVE_DOWNLOADING_FILE](state, fileId);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with added filesDownloadingError`, function() {
    expect.assertions(1);

    const errorInfo = {
      fileId: '123',
      error: 'error',
    };

    const expectedState = new State({
      filesDownloadingError: {
        [errorInfo.fileId]: errorInfo.error,
      },
    });
    const newState = MUTATORS[MUTATOR_NAMES.ADD_FILE_DOWNLOADING_ERROR](state, errorInfo);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed renamingItem with loading`, function() {
    expect.assertions(1);

    const expectedState = new State({
      renamingItem: {},
      itemRenamingErrors: [],
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_RENAMING_ITEM](state, {});

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed renamingItem without loading`, function() {
    expect.assertions(1);

    const expectedState = new State({
      isItemRenaming: false,
      renamingItem: null,
      itemRenamingErrors: [],
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_RENAMING_ITEM](state, null);

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed itemRenamingErrors`, function() {
    expect.assertions(1);

    const expectedState = new State({
      isItemRenaming: false,
      itemRenamingErrors: {},
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS](state, {});

    expect(newState).toStrictEqual(expectedState);
  });

  test(`Should return new state with changed isItemRenaming`, function() {
    expect.assertions(1);

    const expectedState = new State({
      isItemRenaming: true,
    });
    const newState = MUTATORS[MUTATOR_NAMES.SET_IS_ITEM_RENAMING](state, true);

    expect(newState).toStrictEqual(expectedState);
  });
});
