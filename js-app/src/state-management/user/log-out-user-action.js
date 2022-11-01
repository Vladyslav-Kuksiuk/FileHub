import {Action} from '../action';
import {ApiService} from '../../server-connection/api-service';
import {MUTATOR_NAMES} from '../mutators.js';

/**
 * Action to perform user log out.
 */
export class LogOutUserAction extends Action {
  #apiService;


  /**
   * @param {object} payload
   * @param {ApiService} apiService
   */
  constructor(payload, apiService) {
    super(payload);
    this.#apiService = apiService;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    return this.#apiService
        .logOut()
        .then(() => {
          executor(MUTATOR_NAMES.SET_USERNAME, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_ERROR, error);
        });
  }
}
