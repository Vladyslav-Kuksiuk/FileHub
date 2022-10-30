export const USER_MUTATOR_NAMES = {
  SET_IS_LOADING: 'isLoading',
  SET_IS_AUTHORIZED: 'isAuthorized',
  SET_USERNAME: 'setUsername',
  SET_USERID: 'setUserId',
  SET_ERROR: 'setError',
};

export const USER_MUTATORS = {
  [USER_MUTATOR_NAMES.SET_IS_AUTHORIZED]: (state, isAuthorized) =>{
    state.isAuthorized = isAuthorized;
  },
  [USER_MUTATOR_NAMES.SET_IS_LOADING]: (state, isLoading) =>{
    state.isLoading = isLoading;
  },
  [USER_MUTATOR_NAMES.SET_USERNAME]: (state, username) =>{
    state.username = username;
  },
  [USER_MUTATOR_NAMES.SET_ERROR]: (state, error) =>{
    state.error = error;
  },
};
