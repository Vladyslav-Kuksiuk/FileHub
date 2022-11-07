import {STATE} from './state';

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
    return {...state, [STATE.IS_USER_PROFILE_LOADING]: isLoading};
  },
  [MUTATOR_NAMES.SET_USER_PROFILE]: (state, userProfile) =>{
    return {...state, [STATE.USER_PROFILE]: userProfile};
  },
  [MUTATOR_NAMES.SET_USER_PROFILE_ERROR]: (state, error) =>{
    return {...state, [STATE.USER_PROFILE_ERROR]: error};
  },
  [MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING]: (state, isLoading) =>{
    return {...state, [STATE.IS_FOLDER_INFO_LOADING]: isLoading};
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO]: (state, folderInfo) =>{
    return {...state, [STATE.FOLDER_INFO]: folderInfo};
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO_ERROR]: (state, error) =>{
    return {...state, [STATE.FOLDER_INFO_ERROR]: error};
  },
  [MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING]: (state, isLoading) =>{
    return {...state, [STATE.IS_FOLDER_CONTENT_LOADING]: isLoading};
  },
  [MUTATOR_NAMES.SET_FOLDER_CONTENT]: (state, folderContent) =>{
    return {...state, [STATE.FOLDER_CONTENT]: folderContent};
  },
  [MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR]: (state, error) =>{
    return {...state, [STATE.FOLDER_CONTENT_ERROR]: error};
  },
};
