import {TitleService} from './title-service';
import {RequestService} from './server-connection/request-service';
import {ApiService} from './server-connection/api-service';

/**
 * Application context to create and provide dependencies.
 */
export class ApplicationContext {
  #titleService;
  #apiService;

  /**
   * Creates dependencies instances.
   */
  constructor() {
    this.#titleService = new TitleService('FileHub', ' - ');
    this.#apiService = new ApiService(new RequestService());
  }


  /**
   * @returns {TitleService}
   */
  get titleService() {
    return this.#titleService;
  }

  /**
   * @returns {ApiService}
   */
  get apiService() {
    return this.#apiService;
  }
}
