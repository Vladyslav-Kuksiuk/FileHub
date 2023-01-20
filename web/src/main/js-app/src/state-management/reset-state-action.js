import {Action} from './action';
import {MUTATOR_NAMES} from './mutators';

/**
 * Action to reset state to default.
 */
export class ResetStateAction extends Action {
  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.RESET_STATE);
  }
}
