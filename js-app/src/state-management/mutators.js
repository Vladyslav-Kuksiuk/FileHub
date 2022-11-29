import {State} from './state';

export const MUTATOR_NAMES = {
  SET_IS_USER_PROFILE_LOADING: 'isUserProfileLoading',
  SET_USER_PROFILE: 'setUserProfile',
  SET_USER_PROFILE_ERROR: 'setUserProfileError',
  SET_IS_FOLDER_INFO_LOADING: 'isFolderInfoLoading',
  SET_FOLDER_INFO: 'setFolderInfo',
  SET_FOLDER_INFO_ERROR: 'setFolderInfoError',
  SET_IS_FOLDER_CONTENT_LOADING: 'isFolderContentLoading',
  SET_FOLDER_CONTENT: 'setFolderContent',
  SET_FOLDER_CONTENT_ERROR: 'setFolderContentError',
  SET_REMOVING_ITEM: 'setRemovingItem',
  SET_IS_ITEM_DELETING: 'setIsItemDeleting',
  SET_ITEM_DELETING_ERROR: 'setFItemDeletingError',
  SET_LOCATION_METADATA: 'setLocationMetadata',
  ADD_FOLDER_TO_UPLOAD: 'addFolderToUpload',
  REMOVE_FOLDER_TO_UPLOAD: 'removeFolderToUpload',
  ADD_FILES_UPLOADING_ERROR_INFO: 'addFilesUploadingErrorInfo',
  REMOVE_FILES_UPLOADING_ERROR_INFO: 'removeFilesUploadingErrorInfo',
  SET_RENAMING_ITEM: 'setRenamingItem',
  SET_IS_ITEM_RENAMING: 'setIsItemRenaming',
  SET_ITEM_RENAMING_ERRORS: 'setItemRenamingErrors',
};

export const MUTATORS = {
  [MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING]: (state, isLoading) =>{
    if (isLoading) {
      return new State({...state,
        isUserProfileLoading: isLoading,
        userProfile: null,
        userProfileError: null});
    }
    return new State({...state, isUserProfileLoading: isLoading});
  },
  [MUTATOR_NAMES.SET_USER_PROFILE]: (state, userProfile) =>{
    return new State({...state, userProfile: userProfile});
  },
  [MUTATOR_NAMES.SET_USER_PROFILE_ERROR]: (state, error) =>{
    return new State({...state, userProfileError: error});
  },

  [MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING]: (state, isLoading) =>{
    if (isLoading) {
      return new State({...state,
        isFolderInfoLoading: isLoading,
        folderInfo: null,
        folderInfoError: null});
    }
    return new State({...state, isFolderInfoLoading: isLoading});
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO]: (state, folderInfo) =>{
    return new State({...state, folderInfo: folderInfo});
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO_ERROR]: (state, error) =>{
    return new State({...state, folderInfoError: error});
  },

  [MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING]: (state, isLoading) =>{
    if (isLoading) {
      return new State({...state,
        isFolderContentLoading: isLoading,
        folderContent: null,
        folderContentError: null});
    }
    return new State({...state, isFolderContentLoading: isLoading});
  },
  [MUTATOR_NAMES.SET_FOLDER_CONTENT]: (state, folderContent) =>{
    return new State({...state, folderContent: folderContent});
  },
  [MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR]: (state, error) =>{
    return new State({...state, folderContentError: error});
  },

  [MUTATOR_NAMES.SET_IS_ITEM_DELETING]: (state, isDeleting) =>{
    if (isDeleting) {
      return new State({...state,
        isItemDeleting: isDeleting,
        itemDeletingError: null,
      });
    }

    if (!isDeleting && state.itemDeletingError) {
      return new State({...state,
        isItemDeleting: isDeleting,
      });
    }

    return new State({...state,
      isItemDeleting: isDeleting,
      itemInRemovingState: null,
    });
  },
  [MUTATOR_NAMES.SET_REMOVING_ITEM]: (state, item) =>{
    return new State({...state,
      itemInRemovingState: item,
      itemDeletingError: null,
    });
  },
  [MUTATOR_NAMES.SET_ITEM_DELETING_ERROR]: (state, error) =>{
    return new State({...state, itemDeletingError: error});
  },

  [MUTATOR_NAMES.SET_LOCATION_METADATA]: (state, locationMetadata) =>{
    return new State({...state,
      locationMetadata: locationMetadata,
      filesUploadingErrorInfo: {},
    });
  },

  [MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD]: (state, folderId) => {
    return new State({...state,
      foldersToUpload: [...state.foldersToUpload, folderId],
      filesUploadingErrorInfo: {
        ...state.filesUploadingErrorInfo,
        [folderId]: undefined,
      },
    });
  },
  [MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD]: (state, folderId) => {
    return new State({...state,
      foldersToUpload: state.foldersToUpload.filter((folder) => folder !== folderId),
    });
  },
  [MUTATOR_NAMES.ADD_FILES_UPLOADING_ERROR_INFO]: (state, errorInfo) => {
    return new State({...state,
      filesUploadingErrorInfo: {
        ...state.filesUploadingErrorInfo,
        [errorInfo.folderId]: errorInfo.error,
      },
    });
  },

  [MUTATOR_NAMES.SET_RENAMING_ITEM]: (state, itemId) => {
    return new State({...state,
      renamingItem: itemId,
      itemRenamingErrors: [],
    });
  },
  [MUTATOR_NAMES.SET_IS_ITEM_RENAMING]: (state, isRenaming) => {
    if (isRenaming) {
      return new State({...state,
        isItemRenaming: isRenaming,
        itemRenamingErrors: [],
      });
    }

    return new State({...state,
      isItemRenaming: isRenaming,
    });
  },
  [MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS]: (state, errors) => {
    return new State({...state,
      itemRenamingErrors: errors,
    });
  },
};
