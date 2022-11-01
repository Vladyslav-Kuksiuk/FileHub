import {Action} from '../action';
import {ApiService} from '../../server-connection/api-service';
import {MUTATOR_NAMES} from '../mutators.js';

/**
 * Action to perform user loading.
 */
export class LoadUserAction extends Action {
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
    executor(MUTATOR_NAMES.SET_IS_USER_LOADING, true);

    return this.#apiService
        .loadUser()
        .then((body) => {
          executor(MUTATOR_NAMES.SET_USERNAME, body.username);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_ERROR, error.message);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_USER_LOADING, false);
        });
  }
}
