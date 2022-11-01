import {TitleService} from './title-service';
import {RequestService} from './server-connection/request-service';
import {ApiService} from './server-connection/api-service';
import {StateManagementService} from './state-management/state-management-service';
import {MUTATORS} from './state-management/mutators';

/**
 * Application context to create and provide dependencies.
 */
export class ApplicationContext {
  #titleService;
  #apiService;
  #stateManagementService;

  /**
   * Creates dependencies instances.
   */
  constructor() {
    this.#titleService = new TitleService('FileHub', ' - ');
    this.#apiService = new ApiService(new RequestService());

    const state = {
      isUserLoading: false,
      username: null,
      userError: null,
    };

    this.#stateManagementService = new StateManagementService(MUTATORS, state);
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

  /**
   * @returns {StateManagementService}
   */
  get stateManagementService() {
    return this.#stateManagementService;
  }
}
