import {Action} from '../action';
import {ApiService} from '../../server-connection/api-service';
import {MUTATOR_NAMES} from '../mutators';

/**
 * Action to perform user log out.
 */
export class LogOutUserAction extends Action {
  #apiService;

  /**
   * @param {ApiService} apiService
   */
  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    return this.#apiService
        .logOut()
        .then(() => {
          executor(MUTATOR_NAMES.SET_USER_PROFILE, null);
          executor(MUTATOR_NAMES.SET_FOLDER_INFO, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, error.message);
        });
  }
}
