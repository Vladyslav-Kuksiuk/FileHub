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
};
