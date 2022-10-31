import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators.js';

export class LoadUserAction extends Action {
  execute(executor, apiService) {
    executor(MUTATOR_NAMES.SET_IS_USER_LOADING, true);

    return apiService
        .loadUser()
        .then((body) => {
          executor(MUTATOR_NAMES.SET_USERNAME, body.username);
          executor(MUTATOR_NAMES.SET_USER_ERROR, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_ERROR, error.message);
          executor(MUTATOR_NAMES.SET_USERNAME, null);
        })
        .then(()=>{
          executor(MUTATOR_NAMES.SET_IS_USER_LOADING, false);
        });
  }
}
