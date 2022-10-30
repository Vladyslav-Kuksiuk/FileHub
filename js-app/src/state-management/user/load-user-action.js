import {Action} from '../action';
import {USER_MUTATOR_NAMES} from './user-mutator.js';

export const LOAD_USER_ACTION = 'LOAD_USER_ACTION';

export class LoadUserAction extends Action {
  #apiService;

  constructor(apiService, payload) {
    super();

    this.#apiService = apiService;
    this._title = LOAD_USER_ACTION;
    this._payload = payload;
  }

  execute(executor) {
    const {userId} = this._payload;

    executor(USER_MUTATOR_NAMES.SET_IS_LOADING, true);

    return this.#apiService
        .loadUser(userId)
        .then((username) => {
          executor(USER_MUTATOR_NAMES.SET_USERNAME, username);
        })
        .catch((error)=>{
          executor(USER_MUTATOR_NAMES.SET_ERROR, error);
        })
        .finally(()=>{
          executor(USER_MUTATOR_NAMES.SET_IS_LOADING, false);
        });
  }
}
