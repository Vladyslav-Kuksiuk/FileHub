import {TitleService} from './title-service';
import {RequestService} from '../server-connection/request-service';
import {ApiService} from '../server-connection/api-service';
import {StateManagementService} from '../state-management/state-management-service';
import {State} from '../state-management/state';
import {MUTATORS} from '../state-management/mutators';
import {registry} from '../registry';
import {FileTypeIconFactory} from '../components/file-list/file-type-icon-factory.js';


/**
 * Application context to create and provide dependencies.
 */
export class ApplicationContext {
  /**
   * Creates dependencies instances.
   */
  constructor() {
    registry.register('titleService', ()=>{
      return new TitleService('FileHub', ' - ');
    });

    registry.register('apiService', ()=>{
      return new ApiService(new RequestService());
    });

    registry.register('stateManagementService', ()=>{
      return new StateManagementService(MUTATORS, new State());
    });

    registry.register('fileTypeIconFactory', ()=>{
      return new FileTypeIconFactory();
    });

    Object.freeze(this);
  }
}
