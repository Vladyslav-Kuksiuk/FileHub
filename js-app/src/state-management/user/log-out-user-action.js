import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';

/**
 * Action to perform user log out.
 */
export class LogOutUserAction extends Action {
  /**
   * @inheritDoc
   */
  execute(executor, applicationContext) {
    return applicationContext.apiService
        .logOut()
        .then(() => {
          executor(MUTATOR_NAMES.SET_USER_PROFILE, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, error.message);
        });
  }
}
