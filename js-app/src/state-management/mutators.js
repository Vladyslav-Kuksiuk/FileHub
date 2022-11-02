export const MUTATOR_NAMES = {
  SET_IS_USER_LOADING: 'isUserLoading',
  SET_USERNAME: 'setUsername',
  SET_USER_ERROR: 'setUserError',
};

export const MUTATORS = {
  [MUTATOR_NAMES.SET_IS_USER_LOADING]: (state, isLoading) =>{
    return {...state, isUserLoading: isLoading};
  },
  [MUTATOR_NAMES.SET_USERNAME]: (state, username) =>{
    return {...state, username: username};
  },
  [MUTATOR_NAMES.SET_USER_ERROR]: (state, error) =>{
    return {...state, userError: error};
  },
};
