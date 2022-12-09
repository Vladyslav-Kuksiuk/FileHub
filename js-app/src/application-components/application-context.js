import {TitleService} from './title-service';
import {RequestService} from '../server-connection/request-service';
import {ApiService} from '../server-connection/api-service';
import {DownloadService} from '../server-connection/download-service';
import {StateManagementService} from '../state-management/state-management-service';
import {State} from '../state-management/state';
import {MUTATORS} from '../state-management/mutators';
import {registry} from '../registry';
import {FileTypeFactory} from '../components/file-list/file-type-factory';


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

    registry.register('requestService', () => {
      return new RequestService();
    });

    registry.register('apiService', ()=>{
      return new ApiService();
    });

    registry.register('downloadService', ()=>{
      return new DownloadService();
    });

    registry.register('stateManagementService', ()=>{
      return new StateManagementService(MUTATORS, new State());
    });

    registry.register('fileTypeFactory', ()=>{
      return new FileTypeFactory();
    });

    Object.freeze(this);
  }
}
