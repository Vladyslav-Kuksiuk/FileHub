import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from '../../registry';

/**
 * Action to perform user loading.
 */
export class LoadUserAction extends Action {
  @inject apiService;

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, true);
    return this.apiService
        .loadUser()
        .then((userProfile) => {
          executor(MUTATOR_NAMES.SET_USER_PROFILE, userProfile);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, error.message);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING, false);
        });
  }
}
