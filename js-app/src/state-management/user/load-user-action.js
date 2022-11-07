import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators.js';
import {STATE} from '../state.js';

/**
 * Action to perform user loading.
 */
export class LoadUserAction extends Action {
  /**
   * @inheritDoc
   */
  execute(executor, applicationContext) {
    executor(MUTATOR_NAMES.SET_USER_PROFILE, null);
    executor(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, null);
    executor(MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, true);

    return applicationContext.apiService
        .loadUser()
        .then((body) => {
          executor(MUTATOR_NAMES.SET_USER_PROFILE, body[STATE.USER_PROFILE]);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, error.message);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, false);
        });
  }
}
