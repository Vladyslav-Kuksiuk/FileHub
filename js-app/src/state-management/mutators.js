import {STATE} from './state';

export const MUTATOR_NAMES = {
  SET_IS_USER_PROFILE_LOADING: 'isUserProfileLoading',
  SET_USER_PROFILE: 'setUserProfile',
  SET_USER_PROFILE_ERROR: 'setUserProfileError',
  SET_IS_FOLDER_INFO_LOADING: 'isFolderInfoLoading',
  SET_FOLDER_INFO: 'setFolderInfo',
  SET_FOLDER_INFO_ERROR: 'setFolderInfoError',
};

export const MUTATORS = {
  [MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING]: (state, isLoading) =>{
    if (isLoading) {
      return {...state,
        [STATE.IS_USER_PROFILE_LOADING]: isLoading,
        [STATE.USER_PROFILE]: null,
        [STATE.USER_PROFILE_ERROR]: null};
    }
    return {...state, [STATE.IS_USER_PROFILE_LOADING]: isLoading};
  },
  [MUTATOR_NAMES.SET_USER_PROFILE]: (state, userProfile) =>{
    return {...state, [STATE.USER_PROFILE]: userProfile};
  },
  [MUTATOR_NAMES.SET_USER_PROFILE_ERROR]: (state, error) =>{
    return {...state, [STATE.USER_PROFILE_ERROR]: error};
  },
  [MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING]: (state, isLoading) =>{
    if (isLoading) {
      return {...state,
        [STATE.IS_FOLDER_INFO_LOADING]: isLoading,
        [STATE.FOLDER_INFO]: null,
        [STATE.FOLDER_INFO_ERROR]: null};
    }
    return {...state, [STATE.IS_FOLDER_INFO_LOADING]: isLoading};
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO]: (state, userProfile) =>{
    return {...state, [STATE.FOLDER_INFO]: userProfile};
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO_ERROR]: (state, error) =>{
    return {...state, [STATE.FOLDER_INFO_ERROR]: error};
  },
};
