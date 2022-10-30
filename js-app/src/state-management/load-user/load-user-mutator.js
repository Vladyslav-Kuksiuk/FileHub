export const LOAD_USER = {
  SET_IS_LOADING: 'isLoading',
  SET_USERNAME: 'setUsername',
  SET_ERROR: 'setError',
};

export const LOAD_USER_MUTATORS = {
  [LOAD_USER.SET_IS_LOADING]: (state, isLoading) =>{
    state.isLoading = isLoading;
  },
  [LOAD_USER.SET_USERNAME]: (state, username) =>{
    state.username = username;
  },
  [LOAD_USER.SET_ERROR]: (state, error) =>{
    state.error = error;
  },
};
