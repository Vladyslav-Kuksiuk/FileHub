import {Action} from '../action';
import {LOAD_USER} from './load-user-mutator';

export const LOAD_USER_ACTION = 'LOAD_USER_ACTION';

export class loadUserAction extends Action {
  #apiService;

  constructor(apiService, payload) {
    super();

    this.#apiService = apiService;
    this._title = LOAD_USER_ACTION;
    this._payload = payload;
  }

  execute(executor) {
    const {userId} = this._payload;

    executor(LOAD_USER.SET_IS_LOADING, true);

    return this.#apiService
        .loadUser(userId)
        .then((username) => {
          executor(LOAD_USER.SET_USERNAME, username);
        })
        .catch((error)=>{
          executor(LOAD_USER.SET_ERROR, error);
        })
        .finally(()=>{
          executor(LOAD_USER.SET_IS_LOADING, false);
        });
  }
}
