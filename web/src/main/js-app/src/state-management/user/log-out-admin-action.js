import {Action} from '../action';
import {inject} from '../../registry';

/**
 * Action to perform admin log out.
 */
export class LogOutAdminAction extends Action {
  @inject apiService;

  /**
   * @inheritDoc
   */
  execute(executor) {
    return this.apiService.logOutAdmin();
  }
}
