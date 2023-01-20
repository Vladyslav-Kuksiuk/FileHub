import {Action} from '../action';
import {inject} from '../../registry';

/**
 * Action to perform user log out.
 */
export class LogOutUserAction extends Action {
  @inject apiService;

  /**
   * @inheritDoc
   */
  execute(executor) {
    return this.apiService.logOut();
  }
}
