import {Action} from './action';
import {MUTATOR_NAMES} from './mutators';

/**
 * Action to perform location changing.
 */
export class ChangeLocationMetadataAction extends Action {
  #locationMetadata;

  /**
   * @param {object} locationMetadata
   */
  constructor(locationMetadata) {
    super();
    this.#locationMetadata = locationMetadata;
  }

  /**
   * @inheritDoc
   */
  execute(executor) {
    executor(MUTATOR_NAMES.SET_LOCATION_METADATA, this.#locationMetadata);
  }
}
