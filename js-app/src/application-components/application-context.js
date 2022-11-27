import {TitleService} from './title-service';
import {RequestService} from '../server-connection/request-service';
import {ApiService} from '../server-connection/api-service';
import {State} from '../state-management/state';
import {StateManagementService} from '../state-management/state-management-service';
import {MUTATORS} from '../state-management/mutators';

/**
 * Application context to create and provide dependencies.
 */
export class ApplicationContext {
  titleService;
  apiService;
  stateManagementService;

  /**
   * Creates dependencies instances.
   */
  constructor() {
    this.titleService = new TitleService('FileHub', ' - ');
    this.apiService = new ApiService(new RequestService());
    const state = new State();
    this.stateManagementService = new StateManagementService(MUTATORS, state);

    Object.freeze(this);
  }
}
