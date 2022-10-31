import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators.js';

export class LogOutUserAction extends Action {
  execute(executor, apiService) {
    executor(MUTATOR_NAMES.SET_IS_USER_LOADING, true);

    return apiService
        .logOut()
        .then(() => {
          executor(MUTATOR_NAMES.SET_USERNAME, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_ERROR, error);
        })
        .finally(()=>{
          executor(MUTATOR_NAMES.SET_IS_USER_LOADING, false);
        });
  }
}
