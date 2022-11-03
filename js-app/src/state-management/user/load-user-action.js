import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators.js';

/**
 * Action to perform user loading.
 */
export class LoadUserAction extends Action {
  /**
   * @inheritDoc
   */
  execute(executor, applicationContext) {
    executor(MUTATOR_NAMES.SET_IS_USER_LOADING, true);

    return applicationContext.apiService
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
