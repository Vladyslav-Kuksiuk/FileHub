/**
 * Service to generate unique indexes.
 */
export class IndexService {
  static #index = 0;

  /**
   * @returns {string}
   */
  static get index() {
    IndexService.#index += 1;
    return 'FileHub - ' + IndexService.#index;
  }
}
