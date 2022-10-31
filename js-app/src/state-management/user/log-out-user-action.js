import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators.js';

/**
 * Action to perform user log out.
 */
export class LogOutUserAction extends Action {
  /**
   * @inheritDoc
   */
  execute(executor, apiService) {
    return apiService
        .logOut()
        .then(() => {
          executor(MUTATOR_NAMES.SET_USERNAME, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_ERROR, error);
        });
  }
}
