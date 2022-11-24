import {Action} from '../action';
import {MUTATOR_NAMES} from '../mutators';
import {inject} from "../../registry";

/**
 * Action to perform user log out.
 */
export class LogOutUserAction extends Action {
  @inject #apiService;

  /**
   * @inheritDoc
   */
  execute(executor) {
    return this.#apiService
        .logOut()
        .then(() => {
          executor(MUTATOR_NAMES.SET_USER_PROFILE, null);
          executor(MUTATOR_NAMES.SET_FOLDER_INFO, null);
          executor(MUTATOR_NAMES.SET_FOLDER_CONTENT, null);
        })
        .catch((error)=>{
          executor(MUTATOR_NAMES.SET_USER_PROFILE_ERROR, error.message);
        });
  }
}
